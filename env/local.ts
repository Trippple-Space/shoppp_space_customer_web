/**
 *
 * NOTE: The config files should only contain configuration values and
 * not sensitive keys that should rather live in the env files
 */

const localConfig = {
  API_HOST:
    process.env.NEXT_PUBLIC_API_HOST ?? "http://localhost/api/v1",
  VENDOR_CENTER_HOST:
    process.env.NEXT_PUBLIC_VENDOR_CENTER_HOST ?? "http://localhost:3001",
  VENDOR_CENTER_SIGNUP:
    process.env.NEXT_PUBLIC_VENDOR_CENTER_SIGNUP ??
    "http://localhost:3001/auth/signup",
  LANDING_PAGE_HOST:
    process.env.NEXT_PUBLIC_LANDING_PAGE_HOST ??
    "http://localhost:3001/landing-page",
};

export default localConfig;
