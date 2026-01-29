/**
 *
 * NOTE: The config files should only contain configuration values and
 * not sensitive keys that should rather live in the env files
 */

const localConfig = {
  // API_HOST: 'http://localhost:80/api/v1',
   API_HOST: "https://api-ephemeral.asoebi.africa/api/v1",
  // API_HOST: 'https://api-staging.asoebi.africa/api/v1',
  VENDOR_CENTER_HOST: 'https://vendor-staging.asoebi.africa',
  VENDOR_CENTER_SIGNUP: 'https://vendor-staging.asoebi.africa/auth/signup',
  LANDING_PAGE_HOST: 'https://vendor-staging.asoebi.africa/landing-page'
};

export default localConfig;
