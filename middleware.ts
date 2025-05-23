import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/auth'];

function isPublicPath(path: string) {
  return publicPaths.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`));
}

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/api/stripe/webhooks') ||
    req.nextUrl.pathname.startsWith('/api/cron/')
  ) {
    return NextResponse.next();
  }

  const path = req.nextUrl.pathname;
  const { res, user, error } = await updateSession(req);

  if (!isPublicPath(path)) {
    if (!user || error) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (path.startsWith('/api/cron/')) {
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;

    if (!authHeader || !expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.ico|public|api/sitemap|api/events|sitemap.xml|robots.txt|logo.pngsite.webmanifest).*)',
  ],
};
