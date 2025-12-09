# Hosting Configuration

**Last Updated**: 2025-12-09

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

## Environment Variables
| Variable | Set In | Description | Status |
|----------|--------|-------------|--------|
| DATABASE_URL | Vercel | Neon Postgres connection | ⏳ Pending |
| CONTACT_EMAIL | Vercel | Form recipient | ✅ Set |
| FROM_EMAIL | Vercel | Form sender | ✅ Set |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Vercel | Spam protection (public) | ⏳ Pending |
| TURNSTILE_SECRET_KEY | Vercel | Spam protection (server) | ⏳ Pending |
| BLOB_READ_WRITE_TOKEN | Vercel | File storage | ⏳ Pending |
| NEXTAUTH_SECRET | Vercel | Auth encryption | ⏳ Pending |
| NEXTAUTH_URL | Vercel | Auth callback URL | ⏳ Pending |

## Deployment History
| Date | Type | Status |
|------|------|--------|
| 2025-12-07 | Production | ✅ Success |

## Database
- **Provider**: Neon Postgres
- **Project**: Pending Vercel Marketplace integration
- **Region**: Sydney (ap-southeast-2) recommended

## File Storage
- **Provider**: Vercel Blob
- **Purpose**: Product images, PDF datasheets
- **Status**: API routes ready, awaiting BLOB_READ_WRITE_TOKEN

## Notes
- DNS configuration deferred until custom domain setup
- SSL automatic via Vercel
- Live at: https://dewater-products.vercel.app
