# Hosting Configuration

**Last Updated**: 2025-12-07

## Platform
- **Provider**: Vercel (planned)
- **Project ID**: Not linked yet
- **Team**: -

## Domains
| Domain | Status | Type |
|--------|--------|------|
| dewaterproducts.com.au | Pending | Production |

## Environment Variables
| Variable | Set In | Description |
|----------|--------|-------------|
| DATABASE_URL | Vercel | Neon Postgres connection |
| SENDGRID_API_KEY | Vercel | Email service |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Vercel | Spam protection (public) |
| TURNSTILE_SECRET_KEY | Vercel | Spam protection (server) |
| BLOB_READ_WRITE_TOKEN | Vercel | File storage |
| SHIPPING_API_KEY | Vercel | Carrier API |
| NEXTAUTH_SECRET | Vercel | Auth encryption |
| NEXTAUTH_URL | Vercel | Auth callback URL |

## Deployment History
| Date | Type | Status |
|------|------|--------|
| - | - | - |

## Database
- **Provider**: Neon Postgres
- **Project**: Not created yet
- **Region**: Sydney (ap-southeast-2) recommended

## File Storage
- **Provider**: Vercel Blob
- **Purpose**: Product images, PDF datasheets
- **Limits**: 1TB on Pro plan

## Notes
- DNS configuration deferred until deployment phase
- SSL automatic via Vercel
