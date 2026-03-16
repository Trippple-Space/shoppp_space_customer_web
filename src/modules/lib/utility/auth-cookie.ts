const ASOEBI_TOKEN_COOKIE = "asoebi_token";

const DEFAULT_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Returns the cookie domain for cross-subdomain auth when on asoebi.africa
 * or any subdomain (*.asoebi.africa, including staging). Otherwise undefined.
 */
export function getCookieDomain(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const hostname = window.location.hostname;
  if (hostname === "asoebi.africa" || hostname.endsWith(".asoebi.africa")) {
    return ".asoebi.africa";
  }
  return undefined;
}

/**
 * Set the auth token in a cookie so it is sent to all *.asoebi.africa origins.
 */
export function setAuthCookie(
  token: string,
  maxAgeSeconds: number = DEFAULT_MAX_AGE_SECONDS
): void {
  const domain = getCookieDomain();
  const parts = [
    `${ASOEBI_TOKEN_COOKIE}=${encodeURIComponent(token)}`,
    "path=/",
    "SameSite=Lax",
    "Secure",
    `max-age=${maxAgeSeconds}`,
  ];
  if (domain) {
    parts.push(`domain=${domain}`);
  }
  document.cookie = parts.join("; ");
}

/**
 * Read the auth token from the cookie (for cross-subdomain use).
 */
export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${ASOEBI_TOKEN_COOKIE}=([^;]*)`)
  );
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/**
 * Get the auth token from cookie first (cross-subdomain), then localStorage.
 * Use this when you need to read the token without importing auth.service (e.g. to avoid circular deps).
 */
export function getAuthToken(): string | null {
  return getAuthCookie() ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
}

/**
 * Clear the auth cookie (same domain/path as when set).
 */
export function clearAuthCookie(): void {
  const domain = getCookieDomain();
  const parts = [
    `${ASOEBI_TOKEN_COOKIE}=`,
    "path=/",
    "max-age=0",
    "SameSite=Lax",
    "Secure",
  ];
  if (domain) {
    parts.push(`domain=${domain}`);
  }
  document.cookie = parts.join("; ");
}
