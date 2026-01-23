/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Replit/Docker deployments
  output: process.env.REPLIT ? 'standalone' : undefined,

  // Disable dev indicators that interfere with Playwright tests
  // The Next.js overlay can intercept pointer events
  devIndicators: false,

  // Performance optimizations
  compress: true, // Enable gzip compression
  // Note: swcMinify is default in Next.js 15+ (no longer needs explicit config)

  // Externalize react-pdf for server-side rendering compatibility
  // Fixes: "Minified React error #31" when using renderToBuffer
  serverExternalPackages: [
    '@react-pdf/renderer',
    '@react-pdf/layout',
    '@react-pdf/pdfkit',
    '@react-pdf/primitives',
    '@react-pdf/stylesheet',
    '@react-pdf/textkit',
    '@react-pdf/types',
    'react-reconciler',
  ],

  // Security headers
  async headers() {
    return [
      // Prevent admin pages from being indexed by search engines
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
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
              "img-src 'self' data: blob: https://*.blob.vercel-storage.com https://dewaterproducts.com.au https://www.dewaterproducts.com.au https://img.youtube.com https://i.ytimg.com",
              "font-src 'self'",
              "frame-src https://challenges.cloudflare.com https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://*.google.com https://google.com",
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

  // No category/subcategory redirects - site uses flat URL architecture
  // Subcategory pages: /butterfly-valves, /check-valves, /y-strainers, etc.
  // Brand pages: /brands/straub, /brands/orbit, /brands/teekay, etc.
  async redirects() {
    return []
  },

  images: {
    // Disable optimization on Replit (no native sharp)
    unoptimized: !!process.env.REPLIT,
    // Cache optimized images for 31 days (reduces PSI score variance)
    minimumCacheTTL: 2678400,
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
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.ufs.sh',
      },
    ],
  },

  // Allow Replit dev origins
  allowedDevOrigins: process.env.REPLIT
    ? ['*.replit.dev', 'https://*.replit.dev']
    : undefined,
}

module.exports = nextConfig
