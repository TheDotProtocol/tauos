/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg']
  },
  // Force dynamic rendering for API routes that use request data
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/taumail/dashboard',
        permanent: false,
      },
      {
        source: '/developers/ide',
        destination: '/developers/workspace',
        permanent: false,
      },
    ];
  },
  // Disable static optimization for dynamic API routes
  async rewrites() {
    return [
      {
        source: '/api/monitoring/metrics',
        destination: '/api/monitoring/metrics',
      },
      {
        source: '/api/taustore/apps/search',
        destination: '/api/taustore/apps/search',
      },
      {
        source: '/api/taustore/search',
        destination: '/api/taustore/search',
      },
      {
        source: '/api/taucloud/files/list',
        destination: '/api/taucloud/files/list',
      },
      {
        source: '/api/taumail/emails/:path*',
        destination: '/api/taumail/emails/:path*',
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    if (dev && !isServer) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
        aggregateTimeout: 300,
      };
    }
    return config;
  },
}

module.exports = nextConfig