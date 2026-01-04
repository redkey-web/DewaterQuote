# Hosting Configuration

**Last Updated**: 2026-01-04

## Platform
- **Provider**: Vercel ✅ DEPLOYED
- **Project ID**: dewater-products
- **Team**: redkeys-projects
- **GitHub**: https://github.com/redkey-web/DewaterQuote

## Domains
| Domain | Status | Type |
|--------|--------|------|
| dewater-products.vercel.app | ✅ Active | Production (current) |
| dewaterproducts.com.au | ⏳ Pending DNS | Production (target) |

## Environment Variables (Current Status)
| Variable | Set In | Description | Status |
|----------|--------|-------------|--------|
| DATABASE_URL | Vercel | Neon Postgres connection | ✅ Set (Production, Preview) |
| CONTACT_EMAIL | Vercel | Form recipient | ✅ Set |
| FROM_EMAIL | Vercel | Form sender | ✅ Set |
| SENDGRID_API_KEY | Vercel | Email sending | ✅ Set |
| BLOB_READ_WRITE_TOKEN | Vercel | Vercel Blob storage | ✅ Set |
| NEXTAUTH_SECRET | Vercel | Auth encryption | ✅ Set (Production) |
| NEXTAUTH_URL | Vercel | Auth callback URL | ✅ Set (Production) |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Vercel | Spam protection (public) | ✅ Set |
| TURNSTILE_SECRET_KEY | Vercel | Spam protection (server) | ✅ Set |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | Vercel | Google Analytics | ✅ Set |
| UPSTASH_REDIS_REST_URL | Vercel | Rate limiting | ⏳ Optional |
| UPSTASH_REDIS_REST_TOKEN | Vercel | Rate limiting | ⏳ Optional |

## Deployment History
| Date | Type | Status |
|------|------|--------|
| 2025-12-28 | Production | ✅ Success (Replit merge + SEO) |
| 2025-12-14 | Production | ✅ Success (SEO + GA4) |
| 2025-12-11 | Production | ✅ Success (Security + Turnstile) |
| 2025-12-07 | Production | ✅ Success (Initial deploy) |

## Database
- **Provider**: Neon Postgres
- **Status**: ✅ CONFIGURED
- **Region**: Configured via Vercel integration

## File Storage
- **Provider**: Vercel Blob
- **Purpose**: Product images, PDF datasheets
- **Status**: ✅ Active (DeWaPro_READ_WRITE_TOKEN set)

## Production Status
- **Status**: ✅ PRODUCTION READY
- **Live URL**: https://dewater-products.vercel.app
- **Admin Panel**: https://dewater-products.vercel.app/admin
- **Build**: Passing ✅
- **All Core Services**: Active ✅

## DNS Configuration (Pending)
When ready to switch to dewaterproducts.com.au:
1. Add domain in Vercel Dashboard → Settings → Domains
2. Configure DNS records at registrar:
   - A record: 76.76.21.21
   - CNAME: cname.vercel-dns.com
3. Update NEXTAUTH_URL to https://dewaterproducts.com.au
4. Verify SSL provisioned automatically

## Notes
- SSL automatic via Vercel
- Redirects configured for old Neto URLs (30+ rules)
- SEO optimized: sitemap, robots, OG image, favicon
