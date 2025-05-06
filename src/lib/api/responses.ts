import { NextResponse } from 'next/server';

export type ApiErrorType =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR'
  | 'SUBSCRIPTION_REQUIRED'
  | 'BAD_REQUEST'
  | 'ACCOUNT_ERROR'
  | 'PAYMENT_ERROR'
  | 'RESOURCE_ERROR'
  | 'API_ERROR'
  | 'OPENAI_ERROR'
  | 'TWITTER_ERROR'
  | 'DATABASE_ERROR'
  | 'SUBSCRIPTION_ERROR'
  | 'SERVER_ERROR';

export type ErrorSeverity = 'error' | 'warning' | 'info';
export type ErrorCategory =
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'system'
  | 'external'
  | 'business'
  | 'user';

// Standardized error categorization for frontend handling
export const ERROR_CATEGORIES: Record<ApiErrorType, ErrorCategory> = {
  UNAUTHORIZED: 'authentication',
  FORBIDDEN: 'authorization',
  NOT_FOUND: 'system',
  VALIDATION_ERROR: 'validation',
  RATE_LIMIT: 'system',
  SERVICE_UNAVAILABLE: 'system',
  INTERNAL_SERVER_ERROR: 'system',
  SUBSCRIPTION_REQUIRED: 'system',
  BAD_REQUEST: 'validation',
  ACCOUNT_ERROR: 'user',
  PAYMENT_ERROR: 'business',
  RESOURCE_ERROR: 'system',
  API_ERROR: 'system',
  OPENAI_ERROR: 'external',
  TWITTER_ERROR: 'external',
  DATABASE_ERROR: 'system',
  SUBSCRIPTION_ERROR: 'business',
  SERVER_ERROR: 'system',
};

// Standardized error severity for frontend UI treatment
export const ERROR_SEVERITY: Record<ApiErrorType, ErrorSeverity> = {
  UNAUTHORIZED: 'warning',
  FORBIDDEN: 'warning',
  NOT_FOUND: 'warning',
  VALIDATION_ERROR: 'warning',
  RATE_LIMIT: 'warning',
  SERVICE_UNAVAILABLE: 'error',
  INTERNAL_SERVER_ERROR: 'error',
  BAD_REQUEST: 'warning',
  ACCOUNT_ERROR: 'warning',
  PAYMENT_ERROR: 'error',
  RESOURCE_ERROR: 'warning',
  API_ERROR: 'error',
  OPENAI_ERROR: 'error',
  TWITTER_ERROR: 'error',
  DATABASE_ERROR: 'error',
  SUBSCRIPTION_ERROR: 'warning',
  SERVER_ERROR: 'error',
  SUBSCRIPTION_REQUIRED: 'warning',
};

// Standard error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Please sign in to access this resource.',
  FORBIDDEN: "You don't have permission to access this resource.",
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: "You've reached the rate limit. Please try again later.",
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
  INTERNAL_SERVER_ERROR: 'Something went wrong on our end. Our team has been notified.',
  BAD_REQUEST: 'Invalid request. Please check your input and try again.',
  ACCOUNT_ERROR: 'There was an issue with your account. Please check your account settings.',
  PAYMENT_ERROR: 'There was an issue processing your payment. Please check your payment method.',
  RESOURCE_ERROR: "The resource you're trying to access is unavailable.",
  API_ERROR: 'There was an issue with the API. Please try again later.',
  OPENAI_ERROR: 'There was an issue with the AI service. Please try again later.',
  TWITTER_ERROR: 'There was an issue connecting to X/Twitter. Please check your credentials.',
  DATABASE_ERROR: 'There was an issue accessing the database. Please try again later.',
  SUBSCRIPTION_ERROR:
    'There was an issue with your subscription. Please check your subscription status.',
  SUBSCRIPTION_REQUIRED:
    'You need to be signed in to use this feature. Please sign in and try again.',
  SERVER_ERROR: 'An unexpected error occurred while processing your request.',
};

// User-friendly error messages that provide more context and suggested actions
export const USER_FRIENDLY_MESSAGES = {
  UNAUTHORIZED: 'You need to be signed in to use this feature. Please sign in and try again.',
  FORBIDDEN:
    "You don't have access to this feature. This might be due to your current subscription plan.",
  NOT_FOUND: "We couldn't find what you're looking for. It might have been moved or deleted.",
  VALIDATION_ERROR:
    "Some of the information you provided isn't valid. Please review your input and try again.",
  RATE_LIMIT:
    "You've reached your usage limit. Please try again later or upgrade your plan for higher limits.",
  SERVICE_UNAVAILABLE:
    'Our service is temporarily down for maintenance. Please try again in a few minutes.',
  INTERNAL_SERVER_ERROR:
    'We encountered an unexpected error. Our team has been notified and is working on it.',
  BAD_REQUEST: "Your request couldn't be processed. Please check your input and try again.",
  ACCOUNT_ERROR:
    "There's an issue with your account settings. Please update your profile information.",
  PAYMENT_ERROR:
    "We couldn't process your payment. Please check your payment method or try a different one.",
  RESOURCE_ERROR:
    "The resource you're trying to use is currently unavailable. Please try again later.",
  API_ERROR:
    "We're having trouble connecting to one of our services. Please try again in a few minutes.",
  OPENAI_ERROR:
    "Our AI service is experiencing issues. Your request is saved and we'll process it once service is restored.",
  TWITTER_ERROR:
    "We couldn't connect to X/Twitter. Please check your API credentials in your profile settings.",
  DATABASE_ERROR:
    "We're having database connectivity issues. Your work has been saved and we'll complete your request soon.",
  SUBSCRIPTION_ERROR:
    "There's an issue with your subscription. Please check your subscription status in your profile.",
  SUBSCRIPTION_REQUIRED:
    'You need to be signed in to use this feature. Please sign in and try again.',
  SERVER_ERROR:
    'An unexpected error occurred while processing your request. Please try again later or contact support.',
};

// Common fallback actions for error recovery
export const RECOVERY_ACTIONS: Record<ApiErrorType, string> = {
  UNAUTHORIZED: 'Sign in to continue',
  FORBIDDEN: 'Check your subscription plan',
  NOT_FOUND: 'Go back to dashboard',
  VALIDATION_ERROR: 'Edit your input',
  RATE_LIMIT: 'Try again later or upgrade plan',
  SERVICE_UNAVAILABLE: 'Try again later',
  INTERNAL_SERVER_ERROR: 'Contact support if the issue persists',
  BAD_REQUEST: 'Review your request details',
  ACCOUNT_ERROR: 'Update your account settings',
  PAYMENT_ERROR: 'Update payment method',
  RESOURCE_ERROR: 'Try again later',
  API_ERROR: 'Try again later',
  OPENAI_ERROR: 'Try again later',
  TWITTER_ERROR: 'Update X/Twitter credentials',
  DATABASE_ERROR: 'Try again later',
  SUBSCRIPTION_ERROR: 'Check subscription status',
  SERVER_ERROR: 'Try again later or contact support',
  SUBSCRIPTION_REQUIRED: 'Sign in to continue',
};

// Standard HTTP status codes
export const STATUS_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  RATE_LIMIT: 429,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  ACCOUNT_ERROR: 400,
  PAYMENT_ERROR: 400,
  RESOURCE_ERROR: 404,
  API_ERROR: 500,
  OPENAI_ERROR: 502,
  TWITTER_ERROR: 502,
  DATABASE_ERROR: 500,
  SUBSCRIPTION_ERROR: 402,
  SERVER_ERROR: 500,
  SUBSCRIPTION_REQUIRED: 402,
};

// Define more comprehensive error response types
export interface ApiErrorDetails {
  type: ApiErrorType;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  recoveryAction?: string;
  details?: Record<string, unknown>;
  traceId?: string;
}

export interface ErrorResponseBase {
  success: false;
  error: ApiErrorDetails;
}

export type ErrorResponse = ErrorResponseBase;

/**
 * Creates a standardized success response
 * @param data The data to return in the response
 * @param status The HTTP status code (default: 200)
 * @returns A NextResponse with the standardized response format
 */
export function apiResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Generates a unique trace ID for error tracking
 * @returns A string trace ID
 */
function generateTraceId(): string {
  return `err-${Math.random().toString(36).substring(2, 15)}-${Date.now().toString(36)}`;
}

/**
 * Creates a standardized error response with enhanced details for frontend handling
 * @param type The type of error
 * @param message Custom error message (optional)
 * @param details Additional error details (optional)
 * @param traceId Custom trace ID for error tracking (optional)
 * @returns A NextResponse with the standardized error format
 */
export function apiError(
  type: ApiErrorType,
  message?: string,
  details?: Record<string, unknown>,
  traceId?: string
): NextResponse {
  // Generate a trace ID if none was provided
  const errorTraceId = traceId || generateTraceId();

  // Log the error if it's a server error
  if (
    type === 'INTERNAL_SERVER_ERROR' ||
    type === 'DATABASE_ERROR' ||
    type === 'OPENAI_ERROR' ||
    type === 'API_ERROR'
  ) {
    console.error(`API Error [${errorTraceId}]:`, { type, message, details });
  }

  // Create the error response with enhanced details
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      type,
      category: ERROR_CATEGORIES[type],
      severity: ERROR_SEVERITY[type],
      message: message || ERROR_MESSAGES[type],
      userMessage: USER_FRIENDLY_MESSAGES[type],
      recoveryAction: RECOVERY_ACTIONS[type],
      traceId: errorTraceId,
      ...(details && { details }),
    },
  };

  // Add error to error tracking system (if available)
  // This is where you would integrate with error tracking services
  // like Sentry, Bugsnag, etc.

  return NextResponse.json(errorResponse, { status: STATUS_CODES[type] });
}

/**
 * Creates a standardized validation error response
 * @param errors Validation errors
 * @param message Custom error message (optional)
 * @returns A NextResponse with the standardized validation error format
 */
export function validationError(
  errors: Record<string, string[]>,
  message = ERROR_MESSAGES.VALIDATION_ERROR
): NextResponse {
  return apiError('VALIDATION_ERROR', message, { errors });
}

/**
 * Formats the field errors from ZodError for user-friendly display
 * @param zodErrors The errors object from ZodError
 * @returns A record of field names to error messages
 */
export function formatZodErrors(zodErrors: {
  errors?: Array<{ path: string[]; message: string }>;
}): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  if (zodErrors.errors && Array.isArray(zodErrors.errors)) {
    zodErrors.errors.forEach((error) => {
      const path = error.path.join('.');

      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }

      formattedErrors[path].push(error.message);
    });
  }

  return formattedErrors;
}

/**
 * Maps an error to the appropriate API error type
 * @param error The error to map
 * @returns The appropriate ApiErrorType
 */
export function mapErrorToType(error: unknown): ApiErrorType {
  if (error instanceof Error) {
    // Map known error types
    if (error.name === 'PostgrestError') {
      return 'DATABASE_ERROR';
    }

    if (error.name === 'AuthError' || error.message.includes('authentication')) {
      return 'UNAUTHORIZED';
    }

    if (error.message.includes('permission') || error.message.includes('forbidden')) {
      return 'FORBIDDEN';
    }

    if (error.message.includes('not found') || error.message.includes('404')) {
      return 'NOT_FOUND';
    }

    if (error.message.includes('rate limit')) {
      return 'RATE_LIMIT';
    }

    if (error.message.includes('openai') || error.message.includes('gpt')) {
      return 'OPENAI_ERROR';
    }

    if (error.message.includes('twitter') || error.message.includes('x.com')) {
      return 'TWITTER_ERROR';
    }

    if (error.message.includes('stripe') || error.message.includes('payment')) {
      return 'PAYMENT_ERROR';
    }

    if (error.message.includes('subscription')) {
      return 'SUBSCRIPTION_ERROR';
    }
  }

  return 'INTERNAL_SERVER_ERROR';
}

/**
 * Wraps an API handler with enhanced error handling
 * @param handler The API handler function
 * @returns A wrapped handler with error handling
 */
export function withErrorHandling<T extends (..._args: unknown[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error: unknown) {
      console.error('Unhandled API error:', error);

      const traceId = generateTraceId();
      const errorType = mapErrorToType(error);

      const errorDetails =
        process.env.NODE_ENV === 'development'
          ? {
              stack: error instanceof Error ? error.stack : undefined,
              message: error instanceof Error ? error.message : String(error),
              type: error instanceof Error ? error.name : 'UnknownError',
            }
          : undefined;

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while processing your request.';

      return apiError(errorType, errorMessage, errorDetails, traceId);
    }
  }) as T;
}

/**
 * Implements fallback error handling for failed API requests
 * @param error The error that occurred
 * @param fallbackData Optional fallback data to return
 * @returns A standardized error response or fallback data
 */
export function handleApiError<T>(
  error: unknown,
  fallbackData?: T
): ErrorResponse | { success: true; data: T } {
  console.error('API request failed:', error);

  if (fallbackData !== undefined) {
    return { success: true, data: fallbackData };
  }

  const errorType = mapErrorToType(error);
  const traceId = generateTraceId();

  return {
    success: false,
    error: {
      type: errorType,
      category: ERROR_CATEGORIES[errorType],
      severity: ERROR_SEVERITY[errorType],
      message: error instanceof Error ? error.message : ERROR_MESSAGES[errorType],
      userMessage: USER_FRIENDLY_MESSAGES[errorType],
      recoveryAction: RECOVERY_ACTIONS[errorType],
      traceId,
    },
  };
}
