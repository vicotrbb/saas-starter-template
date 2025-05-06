import logger from '@/lib/api/logger';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');

    if (!token || !type) {
      return NextResponse.redirect(new URL('/login?error=Invalid verification link', request.url));
    }

    if (type === 'email') {
      const { data, error } = await supabaseAdmin.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        logger.error('Email verification error:', error);
        return NextResponse.redirect(
          new URL('/login?error=Email verification failed', request.url)
        );
      }

      if (data && data.user) {
        logger.info('User email verified successfully:', { userId: data.user.id });
      }

      return NextResponse.redirect(
        new URL('/login?success=Email verified successfully', request.url)
      );
    }

    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    logger.error('Verification error:', error as Error);
    return NextResponse.redirect(
      new URL('/login?error=An error occurred during verification', request.url)
    );
  }
}
