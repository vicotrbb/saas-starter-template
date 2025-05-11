import { Session, User } from '@supabase/supabase-js';
import { UserRole } from './api.types';

export interface UserContext {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  organizationId: string;
  organizationName: string;
}

export interface OrganizationContext {
  id: string;
  name: string;
}

export interface AuthContext {
  user: User | null;
  session: Session | null;
  userData: UserContext | null;
  userRole: UserRole;
  organizationData: OrganizationContext | null;
  isLoading: boolean;
  isUserDataLoading: boolean;
  signIn: (
    _email: string,
    _password: string
  ) => Promise<
    { user: User; session: Session } | { needsEmailVerification: true; email: string } | undefined
  >;
  signUp: (_email: string, _password: string, _name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (_email: string) => Promise<void>;
  refreshAuthContext: () => Promise<void>;
  hasFeature: (feature: string) => boolean;
  isSubscribedAndActive: () => boolean;
}
