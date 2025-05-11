'use client';

import { ReactNode } from 'react';
import { useAuth } from '../providers/auth-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FeatureGuardProps {
  feature?: string;
  featureName?: string;
  featureDisplayName?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * FeatureGuard component
 *
 * This component conditionally renders its children based on whether
 * the user's subscription tier has access to a specific feature.
 *
 * @example
 * // Only render the component if the user's tier has the directPosting feature
 * <FeatureGuard userTier={userTier} feature="directPosting" featureDisplayName="Direct Posting">
 *   <DirectPostingComponent />
 * </FeatureGuard>
 */
export default function FeatureGuard({
  feature,
  featureName,
  featureDisplayName,
  children,
  fallback,
}: FeatureGuardProps) {
  const featureToCheck = feature || featureName;
  const { hasFeature, isUserDataLoading } = useAuth();

  if (isUserDataLoading) {
    return <div className="bg-muted h-20 animate-pulse rounded-md"></div>;
  }

  const hasAccess = featureToCheck ? hasFeature(featureToCheck) : false;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feature Not Available</DialogTitle>
          <DialogDescription>
            {featureDisplayName || featureToCheck} is not available in your current plan. Please
            upgrade your subscription to access this feature.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
