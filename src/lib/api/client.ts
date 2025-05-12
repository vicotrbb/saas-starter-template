import { toast } from 'sonner';
import { logger } from './logger';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const RATE_LIMIT_RETRY = {
  maxRetries: 3,
  baseDelay: 1000,
};

type RateLimitEvent = {
  endpoint: string;
  limitRemaining: number;
  limitTotal: number;
  resetIn: number;
};

type RateLimitObserver = (_event: RateLimitEvent) => void;
const rateLimitObservers: RateLimitObserver[] = [];

/**
 * Subscribe to rate limit events
 * @param observer Function to call when rate limit events occur
 * @returns Function to unsubscribe
 */
export function onRateLimit(observer: RateLimitObserver): () => void {
  rateLimitObservers.push(observer);

  return () => {
    const index = rateLimitObservers.indexOf(observer);
    if (index !== -1) {
      rateLimitObservers.splice(index, 1);
    }
  };
}

/**
 * Notify observers about rate limit status
 * @param event Rate limit event data
 */
function notifyRateLimitObservers(event: RateLimitEvent): void {
  for (const observer of rateLimitObservers) {
    try {
      observer(event);
    } catch (err) {
      logger.error('Error in rate limit observer:', err);
    }
  }
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    type: string;
    message: string;
    details?: Record<string, unknown>;
    resetIn?: number;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface RequestOptions extends RequestInit {
  useRetry?: boolean;
  toast?: boolean;
}

/**
 * Implements exponential backoff for retrying requests
 * @param fn The function to retry
 * @param retries Number of retries
 * @param delay Initial delay in ms
 * @returns Promise that resolves when the function succeeds or rejects after max retries
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = RATE_LIMIT_RETRY.maxRetries,
  delay = RATE_LIMIT_RETRY.baseDelay
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (
      retries > 0 &&
      ((error instanceof Error && error.message.includes('rate limit')) ||
        (error &&
          typeof error === 'object' &&
          'error' in error &&
          error.error &&
          ((error.error as { type: string }).type === 'RATE_LIMIT' ||
            (typeof (error.error as { message: string }).message === 'string' &&
              (error.error as { message: string }).message.includes('rate limit')))))
    ) {
      const backoffDelay = delay * (1 + Math.random());
      logger.info(
        `Rate limit hit. Retrying in ${Math.round(backoffDelay / 1000)}s... (${retries} attempts left)`
      );

      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }

    throw error;
  }
}

/**
 * Handles API errors
 * @param error The error to handle
 * @returns A rejected promise with the error message
 */
const handleApiError = <T>(error: unknown): Promise<T> => {
  logger.error('API Error:', error);

  let errorMessage: string;

  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    errorMessage = 'Network error. Please check your internet connection and try again.';
    return Promise.reject(new Error(errorMessage));
  }

  if (error instanceof Response) {
    errorMessage = `API Error: ${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = 'An unexpected error occurred';
  }

  return Promise.reject(new Error(errorMessage));
};

/**
 * Base API client for making authenticated requests
 */
export const apiClient = {
  /**
   * Get data from the API
   * @param endpoint The endpoint to fetch data from
   * @param options Request options
   * @param useRetry Whether to use retry
   * @returns Promise that resolves to the fetched data
   */
  async get<T>(endpoint: string, options: RequestInit = {}, useRetry = true): Promise<T> {
    const fetchFn = async (): Promise<T> => {
      try {
        const response = await fetch(`/api/${endpoint}`, {
          method: 'GET',
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
          ...options,
        });

        const rateLimit = {
          limit: response.headers.get('X-RateLimit-Limit'),
          remaining: response.headers.get('X-RateLimit-Remaining'),
          reset: response.headers.get('X-RateLimit-Reset'),
        };

        if (rateLimit.limit && rateLimit.remaining && rateLimit.reset) {
          notifyRateLimitObservers({
            endpoint,
            limitRemaining: parseInt(rateLimit.remaining, 10),
            limitTotal: parseInt(rateLimit.limit, 10),
            resetIn: parseInt(rateLimit.reset, 10),
          });
        }

        if (!response.ok) {
          const errorData = (await response.json()) as ApiErrorResponse;

          if (response.status === 429) {
            const resetIn =
              errorData.error?.resetIn || parseInt(response.headers.get('Retry-After') || '60', 10);

            if (errorData.error) {
              errorData.error.resetIn = resetIn;
            }

            if (!useRetry) {
              toast.error(
                `Rate limit exceeded. Please try again in ${Math.ceil(resetIn / 60)} minute(s).`
              );
            }

            return Promise.reject(errorData);
          }

          return Promise.reject(errorData);
        }

        const data = await response.json();

        if (data && typeof data === 'object' && 'success' in data) {
          if (!data.success) {
            const errorData = data as ApiErrorResponse;
            return Promise.reject(errorData);
          }

          if ('data' in data) {
            return data.data as T;
          }
        }

        return data as T;
      } catch (error) {
        return handleApiError<T>(error);
      }
    };

    if (useRetry) {
      return retryWithBackoff(fetchFn);
    } else {
      return fetchFn();
    }
  },

  /**
   * Get data from the API
   * @param endpoint The endpoint to fetch data from
   * @param options Request options
   * @param useRetry Whether to use retry
   * @returns Promise that resolves to the fetched data
   */
  async post<T>(
    endpoint: string,
    body?: unknown | FormData,
    options: RequestOptions = {},
    useRetry = true
  ): Promise<T> {
    const fetchFn = async (): Promise<T> => {
      try {
        const response = await fetch(`/api/${endpoint}`, {
          method: 'POST',
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
          body: body instanceof FormData ? body : JSON.stringify(body),
          ...options,
        });

        const rateLimit = {
          limit: response.headers.get('X-RateLimit-Limit'),
          remaining: response.headers.get('X-RateLimit-Remaining'),
          reset: response.headers.get('X-RateLimit-Reset'),
        };

        if (rateLimit.limit && rateLimit.remaining && rateLimit.reset) {
          notifyRateLimitObservers({
            endpoint,
            limitRemaining: parseInt(rateLimit.remaining, 10),
            limitTotal: parseInt(rateLimit.limit, 10),
            resetIn: parseInt(rateLimit.reset, 10),
          });
        }

        if (!response.ok) {
          const errorData = (await response.json()) as ApiErrorResponse;

          if (response.status === 429) {
            const resetIn =
              errorData.error?.resetIn || parseInt(response.headers.get('Retry-After') || '60', 10);

            if (errorData.error) {
              errorData.error.resetIn = resetIn;
            }

            if (!useRetry && options.toast) {
              toast.error(
                `Rate limit exceeded. Please try again in ${Math.ceil(resetIn / 60)} minute(s).`
              );
            }

            return Promise.reject(errorData);
          }

          if (options.toast) {
            toast.error(errorData.error?.message || 'Request failed');
          }

          return Promise.reject(errorData);
        }

        const data = await response.json();

        if (data && typeof data === 'object' && 'success' in data) {
          if (!data.success) {
            const errorData = data as ApiErrorResponse;

            if (options.toast) {
              toast.error(errorData.error?.message || 'Request failed');
            }

            return Promise.reject(errorData);
          }

          if ('data' in data) {
            return data.data as T;
          }
        }

        return data as T;
      } catch (error) {
        return handleApiError<T>(error);
      }
    };

    if (useRetry) {
      return retryWithBackoff(fetchFn);
    } else {
      return fetchFn();
    }
  },

  /**
   * Update data on the API
   * @param endpoint The endpoint to update data on
   * @param body The data to update
   * @param options Request options
   * @param useRetry Whether to use retry
   * @returns Promise that resolves to the updated data
   */
  async put<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit = {},
    useRetry = true
  ): Promise<T> {
    const fetchFn = async (): Promise<T> => {
      try {
        const response = await fetch(`/api/${endpoint}`, {
          method: 'PUT',
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
          body: JSON.stringify(body),
          ...options,
        });

        const rateLimit = {
          limit: response.headers.get('X-RateLimit-Limit'),
          remaining: response.headers.get('X-RateLimit-Remaining'),
          reset: response.headers.get('X-RateLimit-Reset'),
        };

        if (rateLimit.limit && rateLimit.remaining && rateLimit.reset) {
          notifyRateLimitObservers({
            endpoint,
            limitRemaining: parseInt(rateLimit.remaining, 10),
            limitTotal: parseInt(rateLimit.limit, 10),
            resetIn: parseInt(rateLimit.reset, 10),
          });
        }

        if (!response.ok) {
          const errorData = (await response.json()) as ApiErrorResponse;

          if (response.status === 429) {
            const resetIn =
              errorData.error?.resetIn || parseInt(response.headers.get('Retry-After') || '60', 10);

            if (errorData.error) {
              errorData.error.resetIn = resetIn;
            }

            if (!useRetry) {
              toast.error(
                `Rate limit exceeded. Please try again in ${Math.ceil(resetIn / 60)} minute(s).`
              );
            }

            return Promise.reject(errorData);
          }

          toast.error(errorData.error?.message || 'Request failed');
          return Promise.reject(errorData);
        }

        const data = await response.json();

        if (data && typeof data === 'object' && 'success' in data) {
          if (!data.success) {
            const errorData = data as ApiErrorResponse;
            toast.error(errorData.error?.message || 'Request failed');
            return Promise.reject(errorData);
          }

          if ('data' in data) {
            return data.data as T;
          }
        }

        return data as T;
      } catch (error) {
        return handleApiError<T>(error);
      }
    };

    if (useRetry) {
      return retryWithBackoff(fetchFn);
    } else {
      return fetchFn();
    }
  },

  /**
   * Delete data from the API
   * @param endpoint The endpoint to delete data from
   * @param options Request options
   * @param useRetry Whether to use retry
   * @returns Promise that resolves to the deleted data
   */
  async delete<T>(endpoint: string, options: RequestInit = {}, useRetry = true): Promise<T> {
    const fetchFn = async (): Promise<T> => {
      try {
        const response = await fetch(`/api/${endpoint}`, {
          method: 'DELETE',
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
          ...options,
        });

        const rateLimit = {
          limit: response.headers.get('X-RateLimit-Limit'),
          remaining: response.headers.get('X-RateLimit-Remaining'),
          reset: response.headers.get('X-RateLimit-Reset'),
        };

        if (rateLimit.limit && rateLimit.remaining && rateLimit.reset) {
          notifyRateLimitObservers({
            endpoint,
            limitRemaining: parseInt(rateLimit.remaining, 10),
            limitTotal: parseInt(rateLimit.limit, 10),
            resetIn: parseInt(rateLimit.reset, 10),
          });
        }

        if (!response.ok) {
          const errorData = (await response.json()) as ApiErrorResponse;

          if (response.status === 429) {
            const resetIn =
              errorData.error?.resetIn || parseInt(response.headers.get('Retry-After') || '60', 10);

            if (errorData.error) {
              errorData.error.resetIn = resetIn;
            }

            if (!useRetry) {
              toast.error(
                `Rate limit exceeded. Please try again in ${Math.ceil(resetIn / 60)} minute(s).`
              );
            }

            return Promise.reject(errorData);
          }

          toast.error(errorData.error?.message || 'Request failed');
          return Promise.reject(errorData);
        }

        const data = await response.json();

        if (data && typeof data === 'object' && 'success' in data) {
          if (!data.success) {
            const errorData = data as ApiErrorResponse;
            toast.error(errorData.error?.message || 'Request failed');
            return Promise.reject(errorData);
          }

          if ('data' in data) {
            return data.data as T;
          }
        }

        return data as T;
      } catch (error) {
        return handleApiError<T>(error);
      }
    };

    if (useRetry) {
      return retryWithBackoff(fetchFn);
    } else {
      return fetchFn();
    }
  },

  /**
   * Patch data on the API
   * @param endpoint The endpoint to patch data on
   * @param body The data to patch
   * @param options Request options
   * @param useRetry Whether to use retry
   * @returns Promise that resolves to the patched data
   */
  async patch<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit = {},
    useRetry = true
  ): Promise<T> {
    const fetchFn = async (): Promise<T> => {
      try {
        const response = await fetch(`/api/${endpoint}`, {
          method: 'PATCH',
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
          body: JSON.stringify(body),
          ...options,
        });

        const rateLimit = {
          limit: response.headers.get('X-RateLimit-Limit'),
          remaining: response.headers.get('X-RateLimit-Remaining'),
          reset: response.headers.get('X-RateLimit-Reset'),
        };

        if (rateLimit.limit && rateLimit.remaining && rateLimit.reset) {
          notifyRateLimitObservers({
            endpoint,
            limitRemaining: parseInt(rateLimit.remaining, 10),
            limitTotal: parseInt(rateLimit.limit, 10),
            resetIn: parseInt(rateLimit.reset, 10),
          });
        }

        if (!response.ok) {
          const errorData = (await response.json()) as ApiErrorResponse;

          if (response.status === 429) {
            const resetIn =
              errorData.error?.resetIn || parseInt(response.headers.get('Retry-After') || '60', 10);

            if (errorData.error) {
              errorData.error.resetIn = resetIn;
            }

            if (!useRetry) {
              toast.error(
                `Rate limit exceeded. Please try again in ${Math.ceil(resetIn / 60)} minute(s).`
              );
            }

            return Promise.reject(errorData);
          }

          toast.error(errorData.error?.message || 'Request failed');
          return Promise.reject(errorData);
        }

        const data = await response.json();

        if (data && typeof data === 'object' && 'success' in data) {
          if (!data.success) {
            const errorData = data as ApiErrorResponse;
            toast.error(errorData.error?.message || 'Request failed');
            return Promise.reject(errorData);
          }

          if ('data' in data) {
            return data.data as T;
          }
        }

        return data as T;
      } catch (error) {
        return handleApiError<T>(error);
      }
    };

    if (useRetry) {
      return retryWithBackoff(fetchFn);
    } else {
      return fetchFn();
    }
  },
};
