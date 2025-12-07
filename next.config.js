/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Replit/Docker deployments
  output: process.env.REPLIT ? 'standalone' : undefined,

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
