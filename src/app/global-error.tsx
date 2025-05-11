import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import logger from '@/lib/api/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    logger.error('Global error boundary caught an error', error, {
      digest: error.digest,
      path: window.location.pathname,
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
            <AlertTriangle className="mx-auto h-24 w-24 text-red-500" />
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Something went wrong!
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button onClick={() => reset()} variant="default">
                Try Again
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
