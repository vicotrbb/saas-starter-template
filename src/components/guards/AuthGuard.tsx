import { ReactNode } from 'react';
import { useAuth } from '../providers/auth-provider';
import UnauthorizedAccess from '@/components/auth/UnauthorizedAccess';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isUserDataLoading, user } = useAuth();

  if (isUserDataLoading) {
    return <div className="bg-muted h-20 animate-pulse rounded-md"></div>;
  }

  if (!user && !isUserDataLoading) {
    return <UnauthorizedAccess />;
  }

  return children;
}
