# Key File Pointers

**Last Updated**: 2026-02-02
**Status**: ✅ PRODUCTION (Next.js 15)

## Entry Points
- Root Layout: `src/app/layout.tsx`
- Homepage: `src/app/page.tsx`
- Global Config: `next.config.js`
- Middleware: `src/middleware.ts` (auth protection)

## Email Pipeline (Critical Path)
- Email Client: `src/lib/email/client.ts` (nodemailer → planned Resend)
- Quote Submission: `src/app/api/quote/route.ts` (⚠️ silent failure bug L895-904)
- Contact Form: `src/app/api/contact/route.ts`
- Admin Send: `src/pages/api/admin/quotes/[id]/send.ts`
- Admin Forward: `src/app/api/admin/quotes/[id]/forward/route.ts`
- Quick Approval: `src/app/api/approve-quote/[token]/route.ts`
- Forgot Password: `src/app/api/auth/forgot-password/route.ts`
- Email Template: `src/lib/email/approved-quote-email.ts`

## PDF Generation
- PDF Template: `src/lib/pdf/quote-pdf.tsx` (@react-pdf/renderer)
- Admin Preview: `src/pages/api/admin/quotes/[id]/pdf.ts`
- Admin Store: `src/pages/api/admin/quotes/[id]/store-pdf.ts`
- **Note**: Pages Router used (not App Router) for @react-pdf Node.js compatibility

## Quote Cart System
- Context: `src/context/QuoteContext.tsx`
- Cart UI: `src/components/QuoteCart.tsx`
- Sticky Button: `src/components/StickyQuoteButton.tsx`
- Quote Utilities: `src/lib/quote.ts`
- Quote Flags: `src/lib/quote-flags.ts`
- Tokens: `src/lib/tokens.ts`

## Product Data
- Database Schema: `src/db/schema.ts` (20 tables)
- DB Connection: `src/db/index.ts`
- Product Queries: `src/lib/db/products.ts`
- Category Queries: `src/lib/db/categories.ts`
- Static Fallback: `src/data/catalog.ts` (build-time only)
- Product Display: `src/app/[slug]/page.tsx`
- Product Detail: `src/components/ProductDetailClient.tsx`
- Product Cards: `src/components/ProductCard.tsx`

## Forms
- Quote Form: `src/app/request-quote/page.tsx`
- Contact Form: `src/app/contact/page.tsx`
- Custom Size Request: `src/components/CustomSizeRequest.tsx`
- Quote API: `src/app/api/quote/route.ts`
- Contact API: `src/app/api/contact/route.ts`

## Admin Panel
- Layout: `src/app/admin/layout.tsx`
- Dashboard: `src/app/admin/page.tsx`
- Products: `src/app/admin/products/page.tsx`, `[id]/page.tsx`, `new/page.tsx`
- Quotes: `src/app/admin/quotes/page.tsx`, `[id]/page.tsx`
- Categories: `src/app/admin/categories/page.tsx`
- Brands: `src/app/admin/brands/page.tsx`
- Redirects: `src/app/admin/redirects/page.tsx`
- Inventory: `src/app/admin/inventory/page.tsx`
- Pricing: `src/app/admin/pricing/page.tsx`
- Logistics: `src/app/admin/logistics/page.tsx`
- Command Palette: `src/components/admin/AdminCommandPalette.tsx`
- Forms: `ProductForm.tsx`, `ProductFormNew.tsx`, `CategoryForm.tsx`, `BrandForm.tsx`, `RedirectForm.tsx`

## Authentication
- NextAuth Config: `src/lib/auth/config.ts`
- Auth Route: `src/app/api/auth/[...nextauth]/route.ts`
- Login: `src/app/admin/login/page.tsx`
- Forgot Password: `src/app/admin/forgot-password/page.tsx`
- Reset Password: `src/app/admin/reset-password/page.tsx`

## Security
- Sanitize: `src/lib/sanitize.ts` (XSS prevention)
- Rate Limit: `src/lib/rate-limit.ts` (Upstash fallback to in-memory)
- Turnstile: `src/lib/turnstile.ts` + `src/components/Turnstile.tsx`
- Postcode: `src/lib/postcode.ts`
- Metro Postcodes: `src/lib/shipping/metro-postcodes.ts`

## API Routes (35 total: 32 App Router + 3 Pages Router)

### Public
- `api/contact/route.ts` - Contact form
- `api/quote/route.ts` - Quote submission
- `api/search/route.ts` - Product search
- `api/approve-quote/[token]/route.ts` - Quick approval
- `api/auth/forgot-password/route.ts` - Password reset request
- `api/auth/reset-password/route.ts` - Password reset

### Admin (auth protected)
- `api/admin/products/route.ts` - Product CRUD
- `api/admin/products/[id]/route.ts` - Product update/delete
- `api/admin/products/[id]/videos/*` - Video management (3 routes)
- `api/admin/categories/*` - Category CRUD (2 routes)
- `api/admin/brands/*` - Brand CRUD (2 routes)
- `api/admin/quotes/[id]/route.ts` - Quote management
- `api/admin/quotes/[id]/forward/route.ts` - Forward quote
- `api/admin/quotes/[id]/restore/route.ts` - Restore deleted quote
- `api/admin/quotes/[id]/email-preview/route.ts` - Preview email
- `api/admin/inventory/*` - Inventory management (3 routes)
- `api/admin/pricing/route.ts` - Pricing management
- `api/admin/redirects/*` - Redirect management (4 routes)
- `api/admin/search/route.ts` - Admin search
- `api/admin/change-password/route.ts` - Change password
- `api/admin/export/inventory/route.ts` - Export data
- `api/upload/route.ts` - File uploads

### Pages Router (PDF-specific)
- `pages/api/admin/quotes/[id]/pdf.ts` - PDF preview
- `pages/api/admin/quotes/[id]/send.ts` - Send quote email
- `pages/api/admin/quotes/[id]/store-pdf.ts` - Store PDF in Blob

## Layout Components
- Header: `src/components/Header.tsx`
- Footer: `src/components/Footer.tsx`
- Providers: `src/components/AppProviders.tsx`

## Homepage Components
- FluidHero: `src/components/FluidHero.tsx`
- MouseParallax: `src/components/MouseParallax.tsx`
- ParallaxSection: `src/components/ParallaxSection.tsx`
- ScrambleCycleText: `src/components/ScrambleCycleText.tsx`
- OrderingGuide: `src/components/OrderingGuide.tsx`

## Analytics
- GA4: `src/components/GoogleAnalytics.tsx`

## Redirects
- Redirect Queries: `src/lib/redirects.ts`
- Middleware: `src/middleware.ts` (handles DB-driven redirects)
