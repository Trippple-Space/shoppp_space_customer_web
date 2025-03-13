import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('In middleware')
  const currentUser = request.cookies.get('currentUser')?.value ?? null;
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? ''; // e.g., merchant.yourdomain.com
  const hostParts = host.split(".");
  const subdomain = hostParts.length >= 3 ? `${hostParts[0]}`.replace('-staging', '') : '';

  console.log('Middleware details:', {
    currentUser,
    pathname,
    url,
    host,
    subdomain
  });

  if (subdomain !== "www" && subdomain !== "api") {
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Avoid redirecting protected routes (e.g., already on login/dashboard)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  if (currentUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['*', '/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
