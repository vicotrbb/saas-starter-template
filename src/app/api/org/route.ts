import { createSupabaseServerClient } from '@/lib/supabase/server-auth';
import type { OrganizationContext } from '@/types/context.types';
import { apiError, apiResponse } from '@/lib/api/responses';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiError('UNAUTHORIZED', 'Unauthorized');
    }

    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select(
        `
        organization_id,
        organizations (
          id,
          name
        )
      `
      )
      .eq('id', user.id)
      .single();

    if (userError || !userProfile || !userProfile.organizations) {
      return apiError('NOT_FOUND', 'Organization not found');
    }

    const organization = userProfile.organizations;

    const organizationContext: OrganizationContext = {
      id: organization.id,
      name: organization.name,
    };

    return apiResponse(organizationContext);
  } catch (error) {
    console.error('Error fetching organization:', error);
    return apiError('INTERNAL_SERVER_ERROR', 'Error fetching organization');
  }
}
