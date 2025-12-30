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
              "frame-src https://challenges.cloudflare.com https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
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

  // Redirects from old Neto URLs to new structure
  // See REDIRECT_MAP.md for full documentation
  async redirects() {
    return [
      // ========================================
      // CATEGORY REDIRECTS
      // ========================================
      {
        source: '/expansion-joints/:path*',
        destination: '/rubber-expansion-joints',
        permanent: true,
      },
      {
        source: '/check-valves/:path*',
        destination: '/valves',
        permanent: true,
      },

      // ========================================
      // STATIC PAGE REDIRECTS
      // ========================================
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/form/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/form/contact-us/',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact-us/',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/_mycart',
        destination: '/request-quote',
        permanent: true,
      },
      {
        source: '/quote',
        destination: '/request-quote',
        permanent: true,
      },

      // ========================================
      // ACCOUNT PAGES (no equivalent - redirect to home)
      // ========================================
      {
        source: '/_myacct',
        destination: '/',
        permanent: false,
      },
      {
        source: '/_myacct/:path*',
        destination: '/',
        permanent: false,
      },

      // ========================================
      // BRAND REDIRECTS
      // ========================================
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
      {
        source: '/straub/',
        destination: '/straub',
        permanent: true,
      },
      {
        source: '/orbit/',
        destination: '/orbit',
        permanent: true,
      },
      {
        source: '/teekay/',
        destination: '/teekay',
        permanent: true,
      },

      // ========================================
      // LEGACY INFO PAGES
      // ========================================
      {
        source: '/about-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/about-us/:path*',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/delivery-policy',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/delivery-policy/:path*',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/returns-policy',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/returns-policy/:path*',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/buying',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/buying/:path*',
        destination: '/products',
        permanent: true,
      },

      // ========================================
      // CATEGORY PAGES (with trailing slashes)
      // ========================================
      {
        source: '/valves/',
        destination: '/valves',
        permanent: true,
      },
      {
        source: '/strainers/',
        destination: '/strainers',
        permanent: true,
      },
      {
        source: '/pipe-couplings/',
        destination: '/pipe-couplings',
        permanent: true,
      },
      {
        source: '/pipe-repair-clamps',
        destination: '/pipe-repair',
        permanent: true,
      },
      {
        source: '/pipe-repair-clamps/',
        destination: '/pipe-repair',
        permanent: true,
      },
      {
        source: '/rubber-expansion-joints/',
        destination: '/rubber-expansion-joints',
        permanent: true,
      },
      {
        source: '/flange-adaptors/',
        destination: '/flange-adaptors',
        permanent: true,
      },
      {
        source: '/products/',
        destination: '/products',
        permanent: true,
      },

      // ========================================
      // PRODUCT URL MIGRATION (old /products/[slug] to /[slug])
      // ========================================
      {
        source: '/products/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ]
  },

  images: {
    // Disable optimization on Replit (no native sharp)
    unoptimized: !!process.env.REPLIT,
    // Cache optimized images for 1 week (reduces re-optimization frequency)
    minimumCacheTTL: 604800,
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
