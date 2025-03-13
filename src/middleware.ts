import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSubstringBefore(input: string, target: string): string {
  const index = input.indexOf(target);
  if (index === -1) {
    return input; // Return the whole string if the target is not found
  }
  return `${input.slice(0, index)}`.replace(/-$/, '');
}

const extractMerchantSubdomainFromHost = (host: string) => {
  const hostParts = host.split(".");
  const subdomain = hostParts.length >= 3 ? `${hostParts[0]}`.replace(/-staging$/, '') : '';
  return getSubstringBefore(subdomain, 'asoebi-client');
}

export function middleware(request: NextRequest) {
  console.log('In middleware')
  const currentUser = request.cookies.get('currentUser')?.value ?? null;
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? ''; // e.g., merchant.yourdomain.com
  const subdomain = extractMerchantSubdomainFromHost(host);
  const reconstructedHost = host.replace(new RegExp(`^${subdomain}([.-])`), '')

  console.log('Middleware details:', {
    currentUser,
    pathname,
    url,
    host,
    subdomain,
    reconstructedHost,
  });

  if (subdomain !== "www" && subdomain !== "api") {
    const pathname = `${subdomain ? '/' : ''}${subdomain}${url.pathname}`;
    console.log('After if subdomain', {
      pathname,
      URL: new URL(`${reconstructedHost}${pathname}`)
    });
    return NextResponse.rewrite(new URL(`${reconstructedHost}${pathname}`));
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
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
