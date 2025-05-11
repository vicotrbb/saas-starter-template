import { createSupabaseServerClient } from '@/lib/supabase/server-auth';
import type { UserContext } from '@/types/context.types';
import { apiError, apiResponse } from '@/lib/api/responses';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiError('UNAUTHORIZED', 'Unauthorized');
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        organizations (
          id,
          name
        )
      `
      )
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return apiError('NOT_FOUND', 'User profile not found');
    }

    const userContext: UserContext = {
      id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
      phoneNumber: profile.phone_number || '',
      role: profile.role,
      organizationId: profile.organizations?.id || '',
      organizationName: profile.organizations?.name || '',
    };

    return apiResponse(userContext);
  } catch (error) {
    console.error('Error fetching user:', error);
    return apiError('INTERNAL_SERVER_ERROR', 'Error fetching user');
  }
}
