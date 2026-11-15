/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wears',
        destination: '/',
        permanent: false,
      },
      {
        source: '/fabrics',
        destination: '/',
        permanent: false,
      },
    ];
  },
  env: {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    LAMBDA_FUNCTION_NAME: process.env.LAMBDA_FUNCTION_NAME,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'asoebi-vendor-products-staging.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'asoebi-vendor-products-staging.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'asoebi-vendor-products-prod.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bot-data.s3.ap-southeast-1.wasabisys.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 31536000, //1 year
  },
};

module.exports = nextConfig;
