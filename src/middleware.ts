import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isReservedPath } from '@/modules/website/reserved-paths';

function getSubstringBefore(input: string, target: string): string {
  const index = input.indexOf(target);
  if (index === -1) {
    return input; // Return the whole string if the target is not found
  }
  return `${input.slice(0, index)}`.replace(/[.-]$/, '');
}

const extractMerchantSubdomainFromHost = (host: string) => {
  const hostParts = host.split(".");
  // `adaeze.localhost:3000` (local dev) is a store host too.
  const isLocalSubdomain = hostParts.length === 2 && hostParts[1].startsWith('localhost');
  const subdomain =
    hostParts.length >= 3 || isLocalSubdomain
      ? `${hostParts[0]}`.replace(/staging$/, '')
      : '';
  return getSubstringBefore(subdomain, 'shoppp-space-customer');
}

export function middleware(request: NextRequest) {
  //const currentUser = request.cookies.get('currentUser')?.value ?? null;
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? ''; // e.g., merchant.yourdomain.com
  const subdomain = extractMerchantSubdomainFromHost(host);
  const reconstructedHost = host.replace(new RegExp(`^${subdomain}([.-])`), '')



  console.log({ pathname, host, subdomain, reconstructedHost })
  /*
  console.log('Middleware details:', {
    currentUser,
    pathname,
    url,
    host,
    subdomain,
    reconstructedHost,
  });
  */

  const proto = reconstructedHost.startsWith('localhost') ? 'http' : 'https';

  if (subdomain && subdomain !== "www" && subdomain !== "api") {
    // all other 
    if (pathname && pathname !== '/') {
      // A published Sanee page (e.g. adaeze.shoppp.space/about) is served by /[slug]/[...sitePath].
      // Paths the app owns (products, checkout, auth, ...) keep their existing routing.
      if (!isReservedPath(pathname)) {
        return NextResponse.rewrite(`${proto}://${reconstructedHost}/${subdomain}${pathname.replace(/\/$/, '')}`);
      }
      /*
      console.log('Products path detected, not prepending subdomain', {
        subdomain,
        pathname,
        URL: `https://${reconstructedHost}${pathname}`
      });
      */
      return NextResponse.rewrite(`${proto}://${reconstructedHost}${pathname}`);
    }

    const newPathname = `/${subdomain}${url.pathname?.replace?.(/\/$/, '')}`;
    /* console.log('After if subdomain', {
      subdomain,
      pathname: newPathname,
      URL: `https://${reconstructedHost}${newPathname}`
    }); */
    return NextResponse.rewrite(`${proto}://${reconstructedHost}${newPathname}`); // store.shoppp.space => shoppp.space/store
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
