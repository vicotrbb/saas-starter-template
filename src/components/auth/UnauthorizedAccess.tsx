'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Suspense } from 'react';

function UnauthorizedAccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPath = searchParams.get('redirectTo') || '/';

  const handleLogin = () => {
    router.push(`/auth/login?redirectTo=${encodeURIComponent(currentPath)}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-primary/10 rounded-full p-3">
              <Lock className="text-primary h-8 w-8" />
            </div>
            <CardTitle className="text-center text-2xl font-bold">Access Restricted</CardTitle>
            <CardDescription className="text-center">
              You need to be signed in to access this page. Please log in to continue.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-md border p-4">
            <p className="text-muted-foreground text-sm">
              This page requires authentication. After logging in, you&apos;ll be redirected back to
              this page automatically.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full">
            Sign In to Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function UnauthorizedAccess() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}
    >
      <UnauthorizedAccessContent />
    </Suspense>
  );
}
