# Codebase Analysis

**Last Updated**: 2026-02-02
**Analyzed By**: webdev:refresh --full
**Previous Update**: 2026-01-10

## Structure Overview
- **Framework**: Next.js 15 (App Router + Pages Router for PDF routes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: File-based (App Router primary, Pages Router for @react-pdf compatibility)
- **State**: Context + localStorage (QuoteContext)
- **Database**: Drizzle ORM + Neon Postgres
- **Auth**: NextAuth.js (credentials)
- **Email**: nodemailer + Google Workspace SMTP (planned migration to Resend)

## File Counts
| Type | Count | Location | Change (from 2026-01-10) |
|------|-------|----------|--------|
| Pages | 61 | src/app/ | -11 (cleanup/consolidation) |
| Components | 87 | src/components/ (27 UI + 60 custom) | +16 |
| API Routes (App Router) | 32 | src/app/api/ | +8 |
| API Routes (Pages Router) | 3 | src/pages/api/ | (PDF routes) |
| Utils/Lib | 17 | src/lib/ | +4 |

## Recent Changes (since 2026-01-10)

### Email Migration (2026-01-24 → 2026-01-29)
- Migrated from SendGrid to Google Workspace SMTP (nodemailer)
- Centralized email client: `src/lib/email/client.ts`
- All 6 email-sending routes updated
- SendGrid package and webhook route removed
- **Note**: Testing phase incomplete; planned migration to Resend HTTP API

### Admin Enhancements (2026-01-28 → 2026-02-02)
- Command palette with search (`AdminCommandPalette.tsx`)
- Redirect management system (`/admin/redirects/`)
- Forgot password / reset password flow
- Quote email preview route
- Admin search API route

### Quote System Improvements
- Custom/non-standard request flag for manual review
- PDF attached to business notification emails
- Delivery, GST, and total inc GST in Quick Summary
- Custom size request component

### UI Polish
- Mouse-controlled parallax effects (homepage)
- Scroll-driven parallax sections
- 3D rotating text in hero
- Lighthouse accessibility fixes

### SEO
- URL restructure: flat → nested for topical authority
- Title optimization, H1 tags, FAQPage schema
- Expansion joints pages optimized for "rubber bellows" keyword

## Database Schema (20 tables)
```
admin_users, brands, categories, products,
product_applications, product_categories, product_downloads,
product_features, product_images, product_seo,
product_shipping, product_specifications, product_stock,
product_supplier, product_variations,
quotes, quote_items,
redirects, subcategories
```

## Security Status

### Fixed
| Issue | Status |
|-------|--------|
| XSS in email templates | ✅ Fixed (escapeHtml) |
| Rate limiting on forms | ✅ Fixed |
| Turnstile CAPTCHA | ✅ Active |
| Security headers (CSP) | ✅ Active |
| Auth middleware | ✅ Active |

### Pending
| Issue | Status |
|-------|--------|
| Admin input validation (zod) | ⏳ Pending |
| Blob URL ownership check | ⏳ Pending |
| Email failure returns success | 🔴 Critical (planned fix in email-resend-migration) |

## Dependencies (Key)

### Frontend
- next: 15.x
- react: ^18.3.1
- framer-motion: ^11.13.1
- react-hook-form: ^7.55.0
- zod: ^3.24.2
- lucide-react: ^0.453.0
- embla-carousel-react: ^8.6.0

### UI
- @radix-ui/* (full suite via shadcn/ui)
- tailwind-merge, class-variance-authority, clsx

### Backend
- drizzle-orm: ^0.39.1
- @neondatabase/serverless: ^0.10.4
- nodemailer: ^7.0.12 (planned replacement with resend)
- next-auth: ^4.x

### Unused (safe to remove)
- @tanstack/react-query: ^5.60.5 (0 imports)

## Routing Structure
- `/` - Home (FluidHero, parallax sections)
- `/[slug]` - Brand/category pages (dynamic)
- `/[slug]/[subcategory]` - Subcategory pages
- `/products` - Product range overview
- `/request-quote` - Quote form (with cart)
- `/contact` - Contact page
- `/approve-quote/[token]` - Quick approval link
- `/admin/*` - Admin panel (auth protected)
- `/about`, `/delivery`, `/privacy`, `/returns`, `/terms`, `/warranty` - Static pages

## Quote System
- Cart stored in localStorage via QuoteContext
- Add-to-quote from product detail pages
- Quote form → API → PDF generation → Email (business + customer)
- Admin can review, forward, resend quotes
- Quick approval via token-based links

## Known Issues
1. **Email delivery unreliable** - SMTP on serverless has transient failures; silent error handling masks failures
2. **Dead code** - 15 unused files identified (Testimonials, FakeTerminal, unused shadcn components)
3. **Incomplete SMTP testing** - Phase 6 of remove-sendgrid plan never completed
