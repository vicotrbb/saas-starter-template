import logger from '@/lib/api/logger';
import { apiError, apiResponse } from '@/lib/api/responses';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getServerUser } from '@/lib/supabase/server-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let user;
    try {
      user = await getServerUser();
    } catch {
      logger.info('No authenticated user, continuing with provided email');
    }

    if (user && email !== user.email) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email,
      });

      if (updateError) {
        logger.error('Error updating email:', updateError);
        return apiError('INTERNAL_SERVER_ERROR', 'Failed to update email');
      }
    }

    const { data, error } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify`,
      },
    });

    logger.info('Resend verification response:', { data, error });

    if (error) {
      logger.error('Error sending verification email:', error);
      return apiError('INTERNAL_SERVER_ERROR', 'Failed to send verification email');
    }

    return apiResponse('Verification email sent successfully');
  } catch (error) {
    logger.error('Error in verification email route:', error as Error);
    return apiError('INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
  }
}
