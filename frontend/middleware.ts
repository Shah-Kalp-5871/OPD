import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  
  const { pathname } = request.nextUrl;

  // 1. Define Public Routes
  const isPublicRoute = pathname === '/login' || pathname === '/';

  // 2. If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Role-based Protection
  if (token && userRole) {

      // Protection logic:
      // /admin/* -> requires ADMIN
      if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // /doctor/* -> requires DOCTOR
      if (pathname.startsWith('/doctor') && userRole !== 'DOCTOR') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // /reception/* -> requires RECEPTION
      if (pathname.startsWith('/reception') && userRole !== 'RECEPTION') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // /nursing/* -> requires NURSING
      if (pathname.startsWith('/nursing') && userRole !== 'NURSING') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // /medical/* -> requires MEDICAL
      if (pathname.startsWith('/medical') && userRole !== 'MEDICAL') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // If already logged in and trying to access login page, redirect to their dashboard
      if (token && pathname === '/login') {
        const redirectMap: Record<string, string> = {
          'ADMIN': '/admin/dashboard',
          'RECEPTION': '/reception/dashboard',
          'DOCTOR': '/doctor/dashboard',
          'NURSING': '/nursing/dashboard',
          'MEDICAL': '/medical/dashboard',
        };
        return NextResponse.redirect(new URL(redirectMap[userRole] || '/', request.url));
      }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/doctor/:path*',
    '/reception/:path*',
    '/nursing/:path*',
    '/medical/:path*',
    '/login',
  ],
};
