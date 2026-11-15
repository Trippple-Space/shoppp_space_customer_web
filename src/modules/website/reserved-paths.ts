/**
 * First path segments owned by the storefront app. A published Sanee page can never shadow them, so the
 * middleware keeps routing these to the app routes. Keep in sync with RESERVED_PATH_SEGMENTS in
 * shoppp_space_api/libs/nest-commerce/src/api/website/constants.ts (the API refuses these as page paths).
 */
export const RESERVED_PATH_SEGMENTS = [
  'api',
  'auth',
  'assets',
  'cart',
  'checkout',
  'contact-us',
  'legal-document',
  'orders',
  'pay',
  'products',
  'profile',
  'rate-vendor',
  'unknown-vendor',
  '_next',
] as const;

export function isReservedPath(pathname: string): boolean {
  const first = pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (!first) return false;
  // Next internals and files with extensions (favicon.ico, robots.txt, images) are never site pages.
  if (first.startsWith('_next') || first.includes('.')) return true;
  return (RESERVED_PATH_SEGMENTS as readonly string[]).includes(first);
}
