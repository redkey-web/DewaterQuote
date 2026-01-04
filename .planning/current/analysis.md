# Codebase Analysis

**Last Updated**: 2026-01-04
**Analyzed By**: webdev:refresh
**Previous Update**: 2025-12-28

## Structure Overview
- **Framework**: Next.js 14 (App Router) ✅ MIGRATED
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: File-based (App Router)
- **State**: Context + localStorage
- **Database**: Drizzle ORM + Neon Postgres
- **Auth**: NextAuth.js (credentials)

## File Counts
| Type | Count | Location | Change |
|------|-------|----------|--------|
| Pages | 41 | src/app/ | +9 (new brand/legal/info pages) |
| Components | 78 | src/components/ (49 UI + 29 custom) | +10 (admin inventory, geo stock, etc.) |
| API Routes | 19 | src/app/api/ | +9 (inventory, pricing, video, search) |
| Utils/Lib | 9 | src/lib/ | +1 (size-sort) |

## Recent Changes (since 2025-12-28)
- **Image audit**:
  - Added image audit scripts
  - Replaced non-original product images
- **UX improvements**:
  - Click-to-call tel: links on all CTA sections
  - Team photos and warranty PDF
  - Geo-based stock messaging (GeoStock.tsx)
- **Category pages**:
  - Redesigned pipe couplings with Orbit/Straub comparison
  - Standardized category page layouts
  - Added expansion-joints routes with subcategories
- **New pages**:
  - /about, /bore-flex, /brands, /delivery
  - /expansion-joints, /meet-the-team, /privacy, /returns
- **Brand work**:
  - Added Bore-Flex brand page
  - Reorganized brands and homepage
  - Enhanced Teekay, Straub content
- **Admin inventory system**:
  - /admin/inventory with bulk actions
  - /admin/pricing with margin calculator
  - /admin/logistics with shipping/supplier data
  - Video management API routes
- **Search**:
  - Added /api/search endpoint

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
