/**
 * Logger utility for consistent logging across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Determines if a log level should be printed based on environment config
 */
function shouldLog(level: LogLevel): boolean {
  if (level === 'debug' && process.env.NODE_ENV === 'production') {
    return false;
  }

  return true;
}

/**
 * Formats the log message with additional context
 */
function formatLogMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (!context) {
    return `${prefix} ${message}`;
  }

  const contextStr = JSON.stringify(context, null, 2);
  return `${prefix} ${message}\n${contextStr}`;
}

/**
 * Log a debug message
 */
export function logDebug(message: string, context?: LogContext): void {
  if (!shouldLog('debug')) {
    return;
  }

  console.debug(formatLogMessage('debug', message, context));
}

/**
 * Log an info message
 */
export function logInfo(message: string, context?: LogContext): void {
  if (!shouldLog('info')) {
    return;
  }

  console.info(formatLogMessage('info', message, context));
}

/**
 * Log a warning message
 */
export function logWarn(message: string, context?: LogContext): void {
  if (!shouldLog('warn')) {
    return;
  }

  console.warn(formatLogMessage('warn', message, context));
}

/**
 * Log an error message
 */
export function logError(message: string, error?: unknown, context?: LogContext): void {
  if (!shouldLog('error')) {
    return;
  }

  const errorContext = {
    ...context,
    error: error && error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : undefined,
  };

  console.error(formatLogMessage('error', message, errorContext));
}

/**
 * The main logger object
 */
export const logger = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
};

export default logger;
