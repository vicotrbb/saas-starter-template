import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DebouncedFunction<T extends (..._args: unknown[]) => unknown> {
  (..._args: Parameters<T>): void;
  cancel: () => void;
}

export function debounce<T extends (..._args: unknown[]) => unknown>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  } as DebouncedFunction<T>;

  debounced.cancel = function () {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

/**
 * Constructs a fully qualified URL by combining the base site URL with a path
 *
 * @param path - The path to append to the base URL
 * @returns A complete URL with the base and path combined
 *
 * @example
 * // Returns 'https://threadrize.com/dashboard'
 * getURL('dashboard')
 *
 * // Returns the base URL (e.g., 'https://threadrize.com')
 * getURL()
 */
export const getURL = (path: string = '') => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
      ? process.env.NEXT_PUBLIC_SITE_URL
      : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
        process?.env?.NEXT_PUBLIC_VERCEL_URL && process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : // If neither is set, default to localhost for local development.
          'http://localhost:3000/';

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, '');
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};

/**
 * Converts a Unix timestamp (in seconds) to a JavaScript Date object
 *
 * @param secs - Unix timestamp in seconds
 * @returns JavaScript Date object representing the timestamp
 *
 * @example
 * // Returns a Date object for January 1, 2023
 * const date = toDateTime(1672531200);
 */
export const toDateTime = (secs: number) => {
  const t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

// Function to calculate estimated token count
export function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters in English
  return Math.ceil(text.length / 4);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
