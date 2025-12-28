import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  // Create a Supabase client for middleware
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Get the session token from cookies
        persistSession: false,
      },
    }
  );

  // Try to get session from cookies
  const authHeader = req.cookies.get('sb-access-token')?.value;
  const hasSession = !!authHeader;

  const isAuthPage =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/landing') ||
    req.nextUrl.pathname.startsWith('/auth/callback');

  const isProtectedPage =
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/suites') ||
    req.nextUrl.pathname.startsWith('/executions') ||
    req.nextUrl.pathname.startsWith('/analytics') ||
    req.nextUrl.pathname.startsWith('/billing');

  // Redirect unauthenticated users from protected pages to login
  if (!hasSession && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users from auth pages to dashboard
  if (hasSession && isAuthPage && !req.nextUrl.pathname.startsWith('/auth/callback')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Handle root path
  if (req.nextUrl.pathname === '/') {
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/landing', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/suites/:path*',
    '/executions/:path*',
    '/analytics/:path*',
    '/billing/:path*',
    '/login',
    '/landing',
    '/auth/:path*',
  ],
};
