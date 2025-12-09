# Codebase Analysis

**Last Updated**: 2025-12-09
**Analyzed By**: webdev:refresh
**Previous Update**: 2025-12-08

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
| Pages | 29 | src/app/ | No change |
| Components | 63 | src/components/ (47 UI + 16 custom) | No change |
| API Routes | 10 | src/app/api/ | No change |
| Utils/Lib | 7 | src/lib/ | +2 new (security) |

## Recent Changes (since 2025-12-08)
- **Security fixes implemented**:
  - Added src/lib/sanitize.ts with XSS prevention utilities
  - Added src/lib/rate-limit.ts with Upstash rate limiting
  - Updated api/contact/route.ts and api/quote/route.ts to use sanitization
  - Rate limiting now active on form submission endpoints
- Added admin products/new page for creating products
- Added admin categories CRUD (list, new, edit pages)
- Added admin brands CRUD (list, new, edit pages)
- Added CategoryForm and BrandForm components
- Added API routes for categories and brands management

## Total LOC
- Pages: ~6,000
- Components: ~6,500
- Admin: ~4,000
- **Total**: ~16,500

## Security Status (Audited 2025-12-09)

### Critical Issues
| Issue | Location | Status |
|-------|----------|--------|
| XSS in email templates | api/contact/route.ts, api/quote/route.ts | ✅ Fixed |
| No rate limiting on forms | api/contact, api/quote | ✅ Fixed |

### High Priority
| Issue | Location | Status |
|-------|----------|--------|
| No Turnstile/CAPTCHA | Contact/quote forms | ⏳ Pending |
| Missing security headers | next.config.js | ⏳ Pending |

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
