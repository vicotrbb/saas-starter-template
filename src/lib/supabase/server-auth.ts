import { Database } from '@/types/database.types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Retrieves the current authenticated user from server components
 *
 * This is a convenience function that extracts just the user object
 * from the session, returning null if no user is authenticated.
 *
 * @returns Promise resolving to the user object if authenticated, or null
 *
 * @example
 * ```ts
 * // In a server component or API route
 * const user = await getServerUser();
 * if (user) {
 *   // User is authenticated
 *   console.log("User email:", user.email);
 * } else {
 *   // Not authenticated
 *   return redirect('/login');
 * }
 * ```
 */
export async function getServerUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return user || null;
}

/**
 * Creates a Supabase client for use in server components
 *
 * This function returns a properly configured Supabase client that
 * can be used in server components or API routes with full typing support.
 *
 * @returns Supabase client instance for server-side operations
 *
 * @example
 * ```ts
 * // In a server component or API route
 * const supabase = createServerClient();
 * const { data: profiles } = await supabase
 *   .from('profiles')
 *   .select('*')
 *   .limit(10);
 * ```
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
