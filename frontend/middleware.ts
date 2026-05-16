import { NextResponse, type NextRequest } from 'next/server';
import { ROUTES, ROLE_REDIRECT_MAP } from './constants/routes';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  
  // Normalize pathname by removing trailing slash for consistent matching
  let { pathname } = request.nextUrl;
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // 1. Define Public Routes (Internal pathnames relative to basePath)
  const isPublicRoute = pathname === ROUTES.LOGIN || pathname === ROUTES.HOME;

  // 2. If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    return NextResponse.redirect(url);
  }

  // 3. Role-based Protection
  if (token && userRole) {
      // If already logged in and trying to access login page, redirect to their dashboard
      if (pathname === ROUTES.LOGIN) {
        const url = request.nextUrl.clone();
        url.pathname = ROLE_REDIRECT_MAP[userRole] || ROUTES.HOME;
        return NextResponse.redirect(url);
      }

      // Check access for specific role sections
      const rolePrefixes = [
        { path: ROUTES.ADMIN, role: 'ADMIN' },
        { path: ROUTES.DOCTOR, role: 'DOCTOR' },
        { path: ROUTES.RECEPTION, role: 'RECEPTION' },
        { path: ROUTES.NURSING, role: 'NURSING' },
        { path: ROUTES.MEDICAL, role: 'MEDICAL' },
        { path: ROUTES.PHARMACY, role: 'PHARMACY' },
        { path: ROUTES.LABORATORY, role: 'LAB_TECHNICIAN' },
      ];

      for (const { path, role } of rolePrefixes) {
        if (pathname.startsWith(path) && userRole !== role) {
          const url = request.nextUrl.clone();
          url.pathname = ROUTES.LOGIN;
          return NextResponse.redirect(url);
        }
      }
  }

  return NextResponse.next();
}

// Matcher config: should NOT include basePath
export const config = {
  matcher: [
    '/admin/:path*',
    '/doctor/:path*',
    '/reception/:path*',
    '/nursing/:path*',
    '/medical/:path*',
    '/pharmacy/:path*',
    '/laboratory/:path*',
    '/login',
  ],
};
