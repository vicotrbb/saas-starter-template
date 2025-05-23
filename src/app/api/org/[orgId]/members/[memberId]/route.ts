import { createSupabaseServerClient } from '@/lib/supabase/server-auth';
import { apiError, apiResponse } from '@/lib/api/responses';
import { NextRequest } from 'next/server';
import { OrganizationMember } from '@/types/api.types';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ orgId: string; memberId: string }> }
) {
  try {
    const params = await props.params;
    const { orgId, memberId } = params;
    const supabase = await createSupabaseServerClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiError('UNAUTHORIZED', 'Unauthorized');
    }

    // Get user's profile to check role and organization membership
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('role, organization_id')
      .eq('id', user.id)
      .single();

    if (userError || !userProfile) {
      return apiError('NOT_FOUND', 'User profile not found');
    }

    // Check authorization - user must belong to the organization or be system-admin
    const isSystemAdmin = userProfile.role === 'system-admin';
    const belongsToOrg = userProfile.organization_id === orgId;

    if (!isSystemAdmin && !belongsToOrg) {
      return apiError(
        'FORBIDDEN',
        "You do not have permission to view this organization's members"
      );
    }

    // Fetch specific organization member
    const { data: member, error: memberError } = await supabase
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
      .eq('id', memberId)
      .eq('organization_id', orgId)
      .is('deleted_at', null) // Exclude soft-deleted users
      .single();

    if (memberError) {
      console.error('Error fetching organization member:', memberError);
      return apiError('NOT_FOUND', 'Member not found in this organization');
    }

    if (!member) {
      return apiError('NOT_FOUND', 'Member not found in this organization');
    }

    // Transform the data to match our interface
    const organizationMember: OrganizationMember = {
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email,
      phoneNumber: member.phone_number,
      role: member.role,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
    };

    return apiResponse(organizationMember);
  } catch (error) {
    console.error('Error in GET /api/org/[orgId]/members/[memberId]:', error);
    return apiError('INTERNAL_SERVER_ERROR', 'Error fetching organization member');
  }
}
