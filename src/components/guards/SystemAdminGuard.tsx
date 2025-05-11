import { ReactNode } from 'react';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { ERROR_MESSAGES } from '@/lib/api/responses';

export default function SystemAdminGuard({ children }: { children: ReactNode }) {
  const { isUserDataLoading, user, userRole } = useAuth();
  const router = useRouter();

  if (isUserDataLoading) {
    return <div className="bg-muted h-20 animate-pulse rounded-md"></div>;
  }

  if (!user && !isUserDataLoading && userRole !== 'system-admin') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ShieldAlert className="text-destructive h-6 w-6" />
              Access Denied
            </CardTitle>
            <CardDescription>You don&apos;t have permission to access this area</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Unauthorized Access</AlertTitle>
              <AlertDescription>{ERROR_MESSAGES.FORBIDDEN}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button variant="default" className="w-full" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return children;
}
