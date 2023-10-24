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
              destination: '/homepage',
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
                source: '/homepage',
                destination: '/',
                permanent: true
            }
        ]
    }
};
  
module.exports = nextConfig
