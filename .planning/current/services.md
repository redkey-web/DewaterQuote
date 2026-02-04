# Installed Services

**Last Updated**: 2026-02-04

## Active Services

### Database: Neon Postgres + Drizzle
- **Status**: ✅ Active
- **Purpose**: Product data, categories, quotes, redirects
- **Env Vars**: DATABASE_URL ✅ Set (Production, Preview, Development)
- **Data**: 3 brands, 7 categories, 11 subcategories, 67+ products, 1200+ variations, 20 tables
- **Files**:
  - src/db/index.ts ✅
  - src/db/schema.ts ✅
  - src/lib/db/products.ts ✅
  - src/lib/db/categories.ts ✅

### Authentication: NextAuth.js
- **Status**: ✅ Active
- **Purpose**: Admin panel access
- **Env Vars**: NEXTAUTH_SECRET ✅, NEXTAUTH_URL ✅
- **Files**:
  - src/app/api/auth/[...nextauth]/route.ts ✅
  - src/lib/auth/config.ts ✅
  - src/middleware.ts ✅
  - src/app/api/auth/forgot-password/route.ts ✅
  - src/app/api/auth/reset-password/route.ts ✅
  - src/app/api/admin/change-password/route.ts ✅

### File Storage: Vercel Blob
- **Status**: ✅ Active
- **Purpose**: Product images, PDF quotes
- **Env Vars**: BLOB_READ_WRITE_TOKEN ✅
- **Files**:
  - src/app/api/upload/route.ts ✅

### Email: Resend HTTP API
- **Status**: ✅ Active
- **Purpose**: Quote/contact form submissions, admin notifications, password reset
- **Package**: resend ^6.9.1
- **Env Vars**: RESEND_API_KEY ✅, FROM_EMAIL ✅, FROM_NAME ✅, CONTACT_EMAIL ✅
- **Files**:
  - src/lib/email/client.ts ✅ (Resend SDK client)
  - src/lib/email/logger.ts ✅ (DB-backed email logging)
  - src/lib/email/approved-quote-email.ts ✅ (email template)
  - src/app/api/contact/route.ts ✅
  - src/app/api/quote/route.ts ✅
  - src/pages/api/admin/quotes/[id]/send.ts ✅
  - src/app/api/admin/quotes/[id]/forward/route.ts ✅
  - src/app/api/approve-quote/[token]/route.ts ✅
  - src/app/api/auth/forgot-password/route.ts ✅
- **Database Logging**: All emails logged to `email_logs` table with status/errors
- **Migration**: Completed 2026-02-04 (see .planning/features/email-resend-migration.md)

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

### PDF Generation: @react-pdf/renderer
- **Status**: ✅ Active
- **Purpose**: Generate quote PDFs for email attachment and admin preview
- **Files**:
  - src/lib/pdf/quote-pdf.tsx ✅ (PDF template)
  - src/app/api/quote/route.ts ✅ (inline generation)
  - src/pages/api/admin/quotes/[id]/pdf.ts ✅ (admin preview)
  - src/pages/api/admin/quotes/[id]/send.ts ✅ (admin send)
  - src/pages/api/admin/quotes/[id]/store-pdf.ts ✅ (blob storage)
- **Note**: Pages Router used for PDF routes due to @react-pdf/renderer Node.js requirement

## Pending Services

### Rate Limiting: Upstash Redis
- **Status**: ⏳ Code exists, env vars not set
- **Purpose**: Prevent API abuse on public endpoints
- **Env Vars**: UPSTASH_REDIS_REST_URL (not set), UPSTASH_REDIS_REST_TOKEN (not set)
- **Files**:
  - src/lib/rate-limit.ts ✅ (falls back to in-memory when Redis unavailable)

## Environment Variables Summary

### Required (Production)
```env
DATABASE_URL=                    # Neon Postgres
BLOB_READ_WRITE_TOKEN=           # Vercel Blob
NEXTAUTH_SECRET=                 # Auth
NEXTAUTH_URL=                    # Auth
RESEND_API_KEY=                  # Email (Resend HTTP API)
FROM_EMAIL=sales@dewaterproducts.com.au  # Email sender address
FROM_NAME=Dewater Products       # Email sender name
CONTACT_EMAIL=sales@dewaterproducts.com.au  # Business notification recipient
NEXT_PUBLIC_TURNSTILE_SITE_KEY=  # Spam protection
TURNSTILE_SECRET_KEY=            # Spam protection
```

### Optional
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=   # Analytics
```
