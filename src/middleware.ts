import { NextResponse, type NextRequest } from 'next/server';

function verifyTokenSimple(token: string): { userId: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (!payload.userId || !payload.email) return null;
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return { userId: payload.userId, email: payload.email, role: payload.role || 'MEMBER' };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicPaths = [
    '/',
    '/features',
    '/how-it-works',
    '/pricing',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/maintenance',
  ];
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path + '/'));

  const publicApiPrefixes = ['/api/auth', '/api/ai', '/api/health'];
  const isPublicApi = publicApiPrefixes.some((prefix) => pathname.startsWith(prefix));

  const token = request.cookies.get('auth_token')?.value;
  const payload = token ? verifyTokenSimple(token) : null;
  const isAuthenticated = !!payload;
  const isAdmin = isAuthenticated && ['SUPER_ADMIN', 'ADMIN', 'SUPPORT_ADMIN'].includes(payload!.role);

  // Maintenance mode check (skip for admin and public)
  const maintenanceCookie = request.cookies.get('maintenance_mode')?.value;
  if (maintenanceCookie === 'true' && !pathname.startsWith('/admin') && !isPublicPath && !isPublicApi && !pathname.startsWith('/api/admin')) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // Admin route protection
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!isAdmin) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (!isAuthenticated && !isPublicPath && !isPublicApi) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    if (isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
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
