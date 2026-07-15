import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_session';
const SESSION_VALUE = 'authenticated';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (but NOT /admin/login or /api/admin/auth)
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isAuthApi = pathname.startsWith('/api/admin/auth');

  if (!isAdminRoute || isLoginPage || isAuthApi) {
    return NextResponse.next();
  }

  const session = req.cookies.get(COOKIE_NAME);
  const isAuthenticated = session?.value === SESSION_VALUE;

  if (!isAuthenticated) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
