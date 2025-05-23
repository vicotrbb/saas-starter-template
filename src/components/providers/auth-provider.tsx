'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupabaseClient } from '@/lib/supabase/client-auth';
import { debounce } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';
import {
  AuthContext as IAuthContext,
  UserContext as IUserContext,
  OrganizationContext,
} from '@/types/context.types';
import { UserRole } from '@/types/api.types';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryClient = useQueryClient();
  const supabase = createSupabaseClient();

  const {
    data: { userData, organizationData } = {
      userData: null,
      organizationData: null,
    },
    isLoading: isUserDataLoading,
  } = useQuery({
    queryKey: ['authContext', user?.id],
    queryFn: async () => {
      if (!user) {
        return { userData: null, organizationData: null };
      }

      try {
        const [userData, organizationData] = await Promise.all([
          apiClient.get<IUserContext>('users'),
          apiClient.get<OrganizationContext>('org'),
        ]);

        return { userData, organizationData };
      } catch {
        return { userData: null, organizationData: null };
      }
    },
    enabled: !!user && !!user.id,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const debouncedRefresh = useMemo(
    () =>
      debounce(() => queryClient.invalidateQueries({ queryKey: ['authContext', user?.id] }), 300),
    [queryClient, user]
  );

  const { mutateAsync: refreshAuthContext } = useMutation({
    mutationFn: async () => {
      if (!user) {
        return;
      }

      debouncedRefresh();
    },
  });

  useEffect(() => {
    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user ?? null);
      setIsLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    }

    loadSession();
  }, [supabase.auth]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message === 'Email not confirmed' || error.code === 'email_not_confirmed') {
            return {
              needsEmailVerification: true as const,
              email,
            };
          }

          throw error;
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
    [supabase.auth]
  );

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      await apiClient.post<void>('auth/register', { email, password, name });
      toast.success(
        'Account created successfully! Please check your email to verify your account.'
      );
    } catch (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    window.location.href = '/';
  }, [supabase.auth]);

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          throw error;
        }

        return;
      } catch (error) {
        throw error;
      }
    },
    [supabase.auth]
  );

  const hasFeature = useCallback((feature: string) => {
    return !!feature;
  }, []);

  const isSubscribedAndActive = useCallback(() => {
    return true;
  }, []);

  const value = useMemo(
    () => ({
      user,
      userData,
      organizationData,
      userRole: userData?.role as UserRole,
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      refreshAuthContext,
      isUserDataLoading,
      hasFeature,
      isSubscribedAndActive,
    }),
    [
      user,
      userData,
      organizationData,
      session,
      isLoading,
      refreshAuthContext,
      isUserDataLoading,
      signIn,
      signOut,
      resetPassword,
      signUp,
      hasFeature,
      isSubscribedAndActive,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
