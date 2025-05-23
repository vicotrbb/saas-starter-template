import { createSupabaseServerClient } from '@/lib/supabase/server-auth';
import { apiError, apiResponse } from '@/lib/api/responses';
import { NextRequest } from 'next/server';
import logger from '@/lib/api/logger';

interface UpdateOrgRequest {
  name: string;
}

export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateOrgRequest = await request.json();
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
      .select('role, organization_id')
      .eq('id', user.id)
      .single();

    if (userError || !userProfile) {
      return apiError('NOT_FOUND', 'User profile not found');
    }

    const isSystemAdmin = userProfile.role === 'system-admin';
    const isOrgAdmin = userProfile.role === 'org-admin';

    if (!isSystemAdmin && !isOrgAdmin) {
      return apiError('FORBIDDEN', 'You do not have permission to update this organization');
    }

    const { data: updatedOrg, error: updateError } = await supabase
      .from('organizations')
      .update({
        name: body.name.trim(),
      })
      .eq('id', userProfile.organization_id)
      .select('id, name, updated_at')
      .single();

    if (updateError) {
      logger.error('Error updating organization:', updateError);
      return apiError('DATABASE_ERROR', 'Failed to update organization');
    }

    if (!updatedOrg) {
      return apiError('NOT_FOUND', 'Organization not found');
    }

    return apiResponse(updatedOrg);
  } catch (error) {
    logger.error('Error in PATCH /api/org/[orgId]:', error);
    return apiError('INTERNAL_SERVER_ERROR', 'Error updating organization');
  }
}
