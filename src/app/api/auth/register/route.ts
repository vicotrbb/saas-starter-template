import logger from '@/lib/api/logger';
import { apiError } from '@/lib/api/responses';
import { apiResponse } from '@/lib/api/responses';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return apiError('BAD_REQUEST', 'Name, email, and password are required');
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        full_name: name,
      },
    });

    if (authError) {
      logger.error('Error creating user:', authError);
      return apiError('INTERNAL_SERVER_ERROR', 'Error creating user account');
    }

    if (!authData.user) {
      return apiError('INTERNAL_SERVER_ERROR', 'Error creating user account');
    }

    try {
      const { error: emailError } = await supabaseAdmin.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify`,
        },
      });

      if (emailError) {
        logger.error('Error sending verification email:', emailError);
      } else {
        logger.info('Verification email sent successfully to:', email);
      }
    } catch (emailError) {
      logger.error('Failed to send verification email:', emailError as Error);
    }

    return apiResponse('User registered successfully');
  } catch (error) {
    logger.error('Registration error:', error as Error);
    return apiError('INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
  }
}
