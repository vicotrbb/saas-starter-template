import { createSupabaseServerClient } from '@/lib/supabase/server-auth';
import { apiError, apiResponse } from '@/lib/api/responses';
import { OrganizationMember } from '@/types/api.types';
import logger from '@/lib/api/logger';

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
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (userError || !userProfile) {
      return apiError('NOT_FOUND', 'User profile not found');
    }

    const { data: members, error: membersError } = await supabase
      .from('users')
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        created_at,
        updated_at
      `
      )
      .eq('organization_id', userProfile.organization_id)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });

    if (membersError) {
      logger.error('Error fetching organization members:', membersError);
      return apiError('DATABASE_ERROR', 'Failed to fetch organization members');
    }

    const organizationMembers: OrganizationMember[] = members.map((member) => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email,
      phoneNumber: member.phone_number,
      role: member.role,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
    }));

    return apiResponse(organizationMembers);
  } catch (error) {
    logger.error('Error in GET /api/org/[orgId]/members:', error);
    return apiError('INTERNAL_SERVER_ERROR', 'Error fetching organization members');
  }
}
