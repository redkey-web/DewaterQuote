# Installed Services

**Last Updated**: 2026-01-04

## Active Services

### Database: Neon Postgres + Drizzle
- **Status**: ✅ Active
- **Purpose**: Product data, categories, files
- **Env Vars**: DATABASE_URL ✅ Set (Production, Preview)
- **Data**: 7 brands, 6 categories, 16 subcategories, 31 products, 412 variations, 60 images, 1 admin user
- **Files**:
  - src/db/index.ts ✅
  - src/db/schema.ts ✅
  - src/lib/db/products.ts ✅
  - src/lib/db/categories.ts ✅
  - scripts/seed.ts ✅
  - scripts/create-admin.ts ✅

### Authentication: NextAuth.js
- **Status**: ✅ Active
- **Purpose**: Admin panel access
- **Env Vars**: NEXTAUTH_SECRET, NEXTAUTH_URL
- **Files**:
  - src/app/api/auth/[...nextauth]/route.ts ✅
  - src/lib/auth/config.ts ✅
  - src/middleware.ts ✅

### File Storage: Vercel Blob
- **Status**: ✅ Active
- **Purpose**: PDF datasheets, product images
- **Env Vars**: BLOB_READ_WRITE_TOKEN
- **Files**:
  - src/app/api/upload/route.ts ✅

### Email: Google Workspace SMTP (via Nodemailer)
- **Status**: 🔄 Configured (awaiting valid App Password)
- **Purpose**: Quote/contact form submissions, admin notifications
- **Package**: nodemailer
- **Env Vars**: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- **Files**:
  - src/lib/email/client.ts ✅ (centralized email client)
  - src/app/api/contact/route.ts ✅
  - src/app/api/quote/route.ts ✅
  - src/pages/api/admin/quotes/[id]/send.ts ✅
  - src/app/api/admin/quotes/[id]/forward/route.ts ✅
  - src/app/api/approve-quote/[token]/route.ts ✅
  - scripts/resend-quotes.ts ✅
- **Note**: SendGrid removed. Waiting for client to generate new Google App Password.

### Spam Protection: Cloudflare Turnstile
- **Status**: ✅ Active
- **Purpose**: Form protection against bots
- **Env Vars**: NEXT_PUBLIC_TURNSTILE_SITE_KEY ✅, TURNSTILE_SECRET_KEY ✅
- **Files**:
  - src/components/Turnstile.tsx ✅
  - src/lib/turnstile.ts ✅
  - src/lib/rate-limit.ts ✅
- **Forms using Turnstile**:
  - /contact ✅
  - /request-quote ✅

### Analytics: Google Analytics (GA4)
- **Status**: ✅ Active
- **Purpose**: User behavior tracking
- **Env Vars**: NEXT_PUBLIC_GA_MEASUREMENT_ID ✅
- **Files**:
  - src/components/GoogleAnalytics.tsx ✅
  - src/app/layout.tsx ✅

## Pending Services

### Rate Limiting: Upstash Redis
- **Status**: ✅ Implemented (awaiting env vars)
- **Purpose**: Prevent API abuse on public endpoints
- **Package**: @upstash/ratelimit, @upstash/redis
- **Env Vars**: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
- **Files**:
  - src/lib/rate-limit.ts ✅
- **Usage**: api/contact/route.ts, api/quote/route.ts

### Shipping: Carrier API
- **Status**: ⏳ Pending research
- **Purpose**: Shipping cost estimates
- **Candidates**: Australia Post, Sendle
- **Env Vars**: SHIPPING_API_KEY
- **Files to create**:
  - src/lib/shipping.ts
  - src/app/api/shipping/estimate/route.ts

## Security Status (Updated 2025-12-09)

### Fixed
| Issue | Files | Status |
|-------|-------|--------|
| XSS in emails | api/contact/route.ts, api/quote/route.ts | ✅ Fixed with escapeHtml() |
| Rate limiting | api/contact, api/quote | ✅ Implemented (needs env vars) |

### Input Sanitization
- **File**: src/lib/sanitize.ts ✅
- **Functions**: escapeHtml(), sanitizeUrl(), escapeEmailHref(), escapeTelHref()
- **Used in**: api/contact/route.ts, api/quote/route.ts

### High Priority - Remaining
| Issue | Files | Fix |
|-------|-------|-----|
| ~~No CAPTCHA~~ | ~~Contact/quote forms~~ | ✅ Turnstile implemented |
| ~~Missing headers~~ | ~~next.config.js~~ | ✅ CSP, X-Frame-Options added |

### Medium Priority - Remaining
| Issue | Files | Fix |
|-------|-------|-----|
| No input validation | api/admin/* | Add zod schemas |
| Blob ownership | api/upload/route.ts | Verify URL ownership |

## Environment Variables Summary

```env
# Database
DATABASE_URL=

# Email (Google Workspace SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sales@dewaterproducts.com.au
SMTP_PASS=

# Spam Protection
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Rate Limiting (NEW - for security)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# File Storage
BLOB_READ_WRITE_TOKEN=

# Shipping
SHIPPING_API_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```
