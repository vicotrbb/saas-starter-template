'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupabaseClient } from '@/lib/supabase/client-auth';
import { debounce } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';

// Define the context for the user data - Implement an interface for the user data
const UserContext = createContext<unknown | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryClient = useQueryClient();
  const supabase = createSupabaseClient();

  // Adds user data to the context
  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        return {};
      } catch (error) {
        console.error('Error fetching user data:', error);
        return {};
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const debouncedRefresh = useMemo(
    () => debounce(() => queryClient.invalidateQueries({ queryKey: ['userData', user?.id] }), 300),
    [queryClient, user]
  );

  const { mutateAsync: refreshUserData } = useMutation({
    mutationFn: async () => {
      if (!user) return;
      debouncedRefresh();
    },
  });

  useEffect(() => {
    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user || null);
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
    if (error) throw error;
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

  const value = useMemo(
    () => ({
      user,
      userData,
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      refreshUserData,
      isUserDataLoading,
    }),
    [
      user,
      userData,
      session,
      isLoading,
      refreshUserData,
      isUserDataLoading,
      signIn,
      signOut,
      resetPassword,
      signUp,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAuth() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }

  return context;
}
