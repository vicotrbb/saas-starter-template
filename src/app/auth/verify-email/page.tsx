'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Mail, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { apiClient } from '@/lib/api/client';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const { user, isUserDataLoading, refreshAuthContext } = useAuth();

  useEffect(() => {
    if (isUserDataLoading) {
      return;
    }

    if (user?.email) {
      setEmail(user.email);
      return;
    }

    try {
      const storedEmail = sessionStorage.getItem('pendingVerificationEmail');

      if (storedEmail) {
        setEmail(storedEmail);
        sessionStorage.removeItem('pendingVerificationEmail');
      }
    } catch (e) {
      console.error('Error accessing sessionStorage:', e as Error);
    }
  }, [user, isUserDataLoading]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);

      const emailToUse = user?.email || email;
      if (!emailToUse) {
        toast.error('Email address is required to resend verification');
        return;
      }

      await apiClient.post<void>('auth/send-verification-email', { email: emailToUse });
      await refreshAuthContext();
      toast.success('Verification email sent! Please check your inbox and spam folder.');
    } catch {
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-primary/10 rounded-full p-3">
              <Mail className="text-primary h-8 w-8" />
            </div>
            <CardTitle className="text-center text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              Please check your email inbox for a verification link. You need to verify your email
              before continuing.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-amber-50 p-4 dark:bg-amber-950/30">
            <div className="flex items-start">
              <AlertTriangle className="mt-0.5 mr-3 h-5 w-5 text-amber-500" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">
                  {isUserDataLoading
                    ? 'Loading verification status...'
                    : 'Waiting for verification'}
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                  We&apos;ve sent a verification link to{' '}
                  <strong>
                    {isUserDataLoading ? '...' : user?.email || email || 'your email'}
                  </strong>
                  . Click the link in that email to verify your account.
                </p>
              </div>
            </div>
          </div>

          {!isUserDataLoading && !user && (
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="mb-2 text-sm font-medium">Enter your email address</h3>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Didn&apos;t receive the email?</h3>
            <ul className="ml-6 list-disc space-y-2 text-sm">
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Allow a few minutes for the email to arrive</li>
              <li>Use the button below to resend the verification email</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleResendEmail}
            className="w-full"
            disabled={isResending || isUserDataLoading}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : isUserDataLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
