/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return {
        beforeFiles: [
            // These rewrites are checked after headers/redirects
            // and before all files including _next/public files which
            // allows overriding page files
            {
              source: '/',
              destination: '/home',
            },
          ],
          afterFiles: [
            // These rewrites are checked after pages/public files
            // are checked but before dynamic routes
          ],
          fallback: [
            // These rewrites are checked after both pages/public files
            // and dynamic routes are checked
          ],
      };
    },
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true
            },
            {
              source: '/',
              destination: '/wears',
              permanent: false
          },
        ]
    },
    env: {
      AWS_REGION: process.env.AWS_REGION,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      LAMBDA_FUNCTION_NAME: process.env.LAMBDA_FUNCTION_NAME,
  },
};
  
module.exports = nextConfig
