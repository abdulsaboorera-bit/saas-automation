import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/api/auth', '/api/n8n'];
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path + '/'));

  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = token ? verifyToken(token) !== null : false;

  if (!isAuthenticated && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
