# Installed Services

**Last Updated**: 2025-12-07

## Active Services

*None currently active - migration in progress*

## Planned Services

### Database: Neon Postgres
- **Status**: Pending setup
- **Purpose**: Product data, categories, files
- **Env Vars**: DATABASE_URL
- **Files to create**:
  - src/lib/db.ts
  - src/db/schema.ts

### Email: SendGrid
- **Status**: Pending setup
- **Purpose**: Quote/contact form submissions
- **Env Vars**: SENDGRID_API_KEY
- **Files to create**:
  - src/lib/email/sendgrid.ts
  - src/app/api/contact/route.ts
  - src/app/api/quote/route.ts

### Spam Protection: Cloudflare Turnstile
- **Status**: Pending setup
- **Purpose**: Form protection
- **Env Vars**: TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY
- **Files to create**:
  - src/components/Turnstile.tsx
  - src/lib/turnstile.ts

### File Storage: Vercel Blob
- **Status**: Pending setup
- **Purpose**: PDF datasheets, product images
- **Env Vars**: BLOB_READ_WRITE_TOKEN
- **Files to create**:
  - src/app/api/upload/route.ts

### Shipping: Carrier API
- **Status**: Pending research
- **Purpose**: Shipping cost estimates
- **Candidates**: Australia Post, Sendle
- **Env Vars**: SHIPPING_API_KEY
- **Files to create**:
  - src/lib/shipping.ts
  - src/app/api/shipping/estimate/route.ts

### Authentication: NextAuth.js
- **Status**: Pending setup
- **Purpose**: Admin panel access
- **Env Vars**: NEXTAUTH_SECRET, NEXTAUTH_URL
- **Files to create**:
  - src/app/api/auth/[...nextauth]/route.ts
  - src/lib/auth.ts

## Environment Variables Summary

```env
# Database
DATABASE_URL=

# Email
SENDGRID_API_KEY=

# Spam Protection
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# File Storage
BLOB_READ_WRITE_TOKEN=

# Shipping
SHIPPING_API_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```
