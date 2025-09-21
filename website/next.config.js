/** @type {import('next').NextConfig} */
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
  }
}

module.exports = nextConfig