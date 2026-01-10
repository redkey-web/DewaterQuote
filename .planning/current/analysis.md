# Codebase Analysis

**Last Updated**: 2026-01-10
**Analyzed By**: webdev:refresh
**Previous Update**: 2026-01-10 (early)

## Structure Overview
- **Framework**: Next.js 15 (App Router) ✅ MIGRATED
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: File-based (App Router)
- **State**: Context + localStorage
- **Database**: Drizzle ORM + Neon Postgres
- **Auth**: NextAuth.js (credentials)

## File Counts
| Type | Count | Location | Change |
|------|-------|----------|--------|
| Pages | 72 | src/app/ | +5 (quote demos, approve-quote) |
| Components | 71 | src/components/ (28 UI + 43 custom) | -9 (cleanup) |
| API Routes | 24 | src/app/api/ | +3 (quote system) |
| Utils/Lib | 13 | src/lib/ | +4 (postcode, pdf, quote, tokens) |

## Recent Changes (since 2026-01-09)
- **Quote System Overhaul**:
  - Full pricing in customer PDF (subtotal, GST, grand total, discount, material certs)
  - Delivery classification by postcode (metro=free, non-metro=TBC)
  - Terminology changed: "Quote Request" → "Quote" throughout
  - Professional invoice-style PDF layout with ABN and terms
  - Fix for quote items saving and PDF generation
- **Straub/Teekay Custom Fields**:
  - Custom specs form for Straub/Teekay products (pipe OD, rubber material, pressure)
  - Database schema extended with 4 new columns on quote_items
  - Custom specs displayed in cart, review page, admin, and emails
- **FluidHero Component**:
  - CSS mask-image reveal effect on homepage hero
  - Mouse tracking with smooth lerp animation
  - Multiple reveal effects (radial, horizontal, vertical, diamond, blur, smoke)
  - Easter egg hotspot for enabling/disabling effect
- **UI Polish**:
  - Hero buttons removed from category pages
  - Brand page blob background fixes
  - Mobile polish (header gradient blur, ticker sizing, breadcrumb truncation)
  - Header chrome shimmer effect removed

## Previous Changes (2026-01-04 to 2026-01-05)
- **Brand URL Restructure**:
  - `/straub` → `/straub-couplings-repair-clamps` (now `/brand/straub-couplings`)
  - `/orbit` → `/orbit-couplings`
  - Created `/duplex-basket-strainers` and `/flanged-suction-strainers` subcategory pages
  - Sitemap now fully dynamic from database
- **Flat URL Architecture**:
  - All subcategories at root level (e.g., `/butterfly-valves`, `/y-strainers`)
  - Removed ALL redirects from middleware (direct links only)
  - 21 new flat subcategory pages created
- **Menu Styling**:
  - Teal background with white text on hover across all menus
  - Updated select component, search dropdowns, mobile menu
- **Legacy Brand Merge**:
  - Merged 4 legacy Orbit brand slugs into main Orbit brand (9 products)

## Previous Changes (2026-01-03 to 2026-01-04)
- **Admin Quote Management**:
  - Quotes saved to database with unique quote numbers (QR-YYYYMMDD-XXX)
  - /admin/quotes list page with sortable/filterable table
  - /admin/quotes/[id] detail page with status management
  - Shipping cost addition before forwarding to client
- **Header Navigation**:
  - Restructured dropdown menus
  - Solid dropdown backgrounds
- **Geo-Pricing**:
  - Prices restricted to Australian visitors only

## Previous Changes (2025-12-28 to 2026-01-03)
- **Image audit**: Replaced non-original product images
- **UX improvements**: Click-to-call tel: links, team photos, warranty PDF
- **Category pages**: Redesigned pipe couplings, standardized layouts
- **New pages**: /about, /bore-flex, /brands, /delivery, /expansion-joints, /meet-the-team, /privacy, /returns
- **Admin inventory system**: /admin/inventory, /admin/pricing, /admin/logistics

## Previous Changes (2025-12-14 to 2025-12-28)
- **Google Analytics (GA4)**: Integrated
- **SEO enhancements**: Root-level URLs, favicon, OG image
- **Spam protection**: Turnstile CAPTCHA
- **Admin panel**: Complete with full CRUD

## Total LOC (Estimated)
- Pages: ~8,000
- Components: ~8,500
- Admin: ~6,000
- **Total**: ~22,500

## Security Status (Audited 2025-12-09)

### Critical Issues
| Issue | Location | Status |
|-------|----------|--------|
| XSS in email templates | api/contact/route.ts, api/quote/route.ts | ✅ Fixed |
| No rate limiting on forms | api/contact, api/quote | ✅ Fixed |

### High Priority
| Issue | Location | Status |
|-------|----------|--------|
| No Turnstile/CAPTCHA | Contact/quote forms | ✅ Fixed |
| Missing security headers | next.config.js | ✅ Fixed |

### Medium Priority
| Issue | Location | Status |
|-------|----------|--------|
| Admin input validation | api/admin/* routes | ⏳ Pending |
| Blob URL ownership check | api/upload/route.ts | ⏳ Pending |

See security audit for full details and remediation plan.

## Dependencies (Key)

### Frontend
- react: ^18.3.1
- wouter: ^3.3.5
- @tanstack/react-query: ^5.60.5
- framer-motion: ^11.13.1
- react-hook-form: ^7.55.0
- zod: ^3.24.2
- lucide-react: ^0.453.0
- embla-carousel-react: ^8.6.0
- recharts: ^2.15.2

### UI
- @radix-ui/* (full suite)
- tailwind-merge
- class-variance-authority
- clsx

### Backend
- express: ^4.21.2
- drizzle-orm: ^0.39.1
- @neondatabase/serverless: ^0.10.4

## Existing Integrations
- **Neto API**: Product data source (will be replaced by Postgres)
- **No email service**: Forms console.log only
- **No spam protection**: None configured

## Routing Structure
- `/` - Home
- `/products` - Product range overview
- `/products/:slug` - Product detail
- `/pipe-couplings`, `/valves`, `/rubber-expansion-joints`, `/strainers` - Categories
- `/:category/:subcategory` - Subcategory listings
- `/brands/:brand` - Brand pages
- `/industries/:industry` - Industry pages
- `/request-quote` - Quote form (with cart items)
- `/contact` - Contact page

## Quote System
- Cart items stored in localStorage
- Add-to-quote from product pages
- Quote summary on RequestQuotePage
- No backend submission (console.log only)

## Forms Identified
1. **Quote Request** (RequestQuotePage.tsx)
   - Fields: name, email, phone, company, message
   - Validation: Zod schema
   - Backend: None (console.log)

2. **Contact Form** (ContactPage.tsx)
   - Fields: name, email, phone, company, message
   - Validation: Basic HTML required
   - Backend: None (console.log)

## Novel Patterns
- framer-motion for animations
- embla-carousel for product carousels
- Custom quote cart with localStorage persistence
- Neto API integration (to be replaced)
