import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { generateMetadata } from './metadata';
import { Button } from '@/components/ui/button';

export const metadata = generateMetadata({
  title: 'Page Not Found',
  description: 'Sorry, the page you are looking for cannot be found.',
  noIndex: true,
  path: '/404',
});

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <AlertCircle className="text-muted-foreground mx-auto h-24 w-24" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
