# Hosting Configuration

**Last Updated**: 2025-12-11

## Platform
- **Provider**: Vercel ✅ DEPLOYED
- **Project ID**: dewater-products
- **Team**: redkeys-projects
- **GitHub**: https://github.com/redkey-web/DewaterQuote

## Domains
| Domain | Status | Type |
|--------|--------|------|
| dewater-products.vercel.app | ✅ Active | Preview |
| dewaterproducts.com.au | Pending | Production |

## Environment Variables (Current Status)
| Variable | Set In | Description | Status |
|----------|--------|-------------|--------|
| DATABASE_URL | Vercel | Neon Postgres connection | ✅ Set (Production, Preview) |
| CONTACT_EMAIL | Vercel | Form recipient | ✅ Set |
| FROM_EMAIL | Vercel | Form sender | ✅ Set |
| DeWaPro_READ_WRITE_TOKEN | Vercel | Vercel Blob storage | ✅ Set |
| NEXTAUTH_SECRET | Vercel | Auth encryption | ✅ Set (Production) |
| NEXTAUTH_URL | Vercel | Auth callback URL | ✅ Set (Production) |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Vercel | Spam protection (public) | ⏳ Pending |
| TURNSTILE_SECRET_KEY | Vercel | Spam protection (server) | ⏳ Pending |
| UPSTASH_REDIS_REST_URL | Vercel | Rate limiting | ⏳ Pending |
| UPSTASH_REDIS_REST_TOKEN | Vercel | Rate limiting | ⏳ Pending |

## Deployment History
| Date | Type | Status |
|------|------|--------|
| 2025-12-07 | Production | ✅ Success |

## Database
- **Provider**: Neon Postgres
- **Status**: ✅ CONFIGURED
- **Region**: Configured via Vercel integration

## File Storage
- **Provider**: Vercel Blob
- **Purpose**: Product images, PDF datasheets
- **Status**: ✅ Active (DeWaPro_READ_WRITE_TOKEN set)

## Notes
- DNS configuration deferred until custom domain setup
- SSL automatic via Vercel
- Live at: https://dewater-products.vercel.app
- Admin panel: https://dewater-products.vercel.app/admin
