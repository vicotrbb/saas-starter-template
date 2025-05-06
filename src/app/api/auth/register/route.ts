import logger from '@/lib/api/logger';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
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
      return NextResponse.json({ error: 'Error creating user account' }, { status: 500 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Error creating user account' }, { status: 500 });
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

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    logger.error('Registration error:', error as Error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
