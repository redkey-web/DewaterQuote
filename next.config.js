/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Replit/Docker deployments
  output: process.env.REPLIT ? 'standalone' : undefined,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.blob.vercel-storage.com https://dewaterproducts.com.au https://www.dewaterproducts.com.au",
              "font-src 'self'",
              "frame-src https://challenges.cloudflare.com",
              "connect-src 'self' https://challenges.cloudflare.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // Redirects from old URLs to new structure
  async redirects() {
    return [
      // Brand pages - redirect /brands/* to top-level
      {
        source: '/brands/straub',
        destination: '/straub',
        permanent: true,
      },
      {
        source: '/brands/orbit',
        destination: '/orbit',
        permanent: true,
      },
      {
        source: '/brands/teekay',
        destination: '/teekay',
        permanent: true,
      },
      // Old pipe repair clamps URL to new pipe repair page
      {
        source: '/pipe-repair-clamps',
        destination: '/pipe-repair',
        permanent: true,
      },
    ]
  },

  images: {
    // Disable optimization on Replit (no native sharp)
    unoptimized: !!process.env.REPLIT,
    // Allow images from common sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'www.dewaterproducts.com.au',
      },
      {
        protocol: 'https',
        hostname: 'dewaterproducts.com.au',
      },
    ],
  },

  // Allow Replit dev origins
  allowedDevOrigins: process.env.REPLIT
    ? ['*.replit.dev', 'https://*.replit.dev']
    : undefined,
}

module.exports = nextConfig
