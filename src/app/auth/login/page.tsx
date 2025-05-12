'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import LoginLoading from '@/components/loading/LoadingFallback';

function LoginContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (error) {
      toast.error(error);
    }

    if (success) {
      toast.success(success);
    }
  }, [searchParams]);

  return <div className="flex min-h-screen items-center justify-center">{/* <Login /> */}</div>;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
