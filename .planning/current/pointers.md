# Key File Pointers

**Last Updated**: 2026-01-04
**Status**: ✅ MIGRATED TO NEXT.JS

## Current Structure (Next.js 14)

### Entry Points
- Entry Point: `src/app/page.tsx`
- Root Layout: `src/app/layout.tsx`
- Global Config: `next.config.js`
- Package Info: `package.json`

### Routing
- File-based routing in `src/app/`
- Dynamic routes: `[slug]`, `[category]`, `[id]`

### Working with Forms
- Quote Form: `src/app/request-quote/page.tsx`
- Contact Form: `src/app/contact/page.tsx`
- Form Components: `src/components/ui/form.tsx`
- API Routes: `src/app/api/contact/route.ts`, `src/app/api/quote/route.ts`

### Quote Cart System
- Context: `src/context/QuoteContext.tsx`
- Cart UI: `src/components/QuoteCart.tsx`
- Sticky Button: `src/components/StickyQuoteButton.tsx`
- Types: `src/types/index.ts`

### Product Data
- Database Schema: `src/db/schema.ts`
- Product Queries: `src/lib/db/products.ts`
- Category Queries: `src/lib/db/categories.ts`
- Static Fallback: `src/data/catalog.ts`
- Product Display: `src/app/products/[slug]/page.tsx`
- Product Cards: `src/components/ProductCard.tsx`

### Styling
- Global Styles: `src/app/globals.css`
- Tailwind Config: `tailwind.config.ts`
- UI Components: `src/components/ui/` (47 shadcn components)

### Layout Components
- Header: `src/components/Header.tsx`
- Footer: `src/components/Footer.tsx`
- Providers: `src/components/AppProviders.tsx`

### Admin Panel
- Layout: `src/app/admin/layout.tsx`
- Dashboard: `src/app/admin/page.tsx`
- Products: `src/app/admin/products/page.tsx`, `[id]/page.tsx`, `new/page.tsx`
- Categories: `src/app/admin/categories/page.tsx`, `[id]/page.tsx`, `new/page.tsx`
- Brands: `src/app/admin/brands/page.tsx`, `[id]/page.tsx`, `new/page.tsx`
- Forms: `src/components/admin/ProductForm.tsx`, `CategoryForm.tsx`, `BrandForm.tsx`
- Uploads: `src/components/admin/ImageUpload.tsx`, `FileUpload.tsx`

### Authentication
- NextAuth Config: `src/lib/auth/config.ts`
- Auth Route: `src/app/api/auth/[...nextauth]/route.ts`
- Middleware: `src/middleware.ts`
- Login Page: `src/app/admin/login/page.tsx`

### API Routes (19 total)
- `api/contact/route.ts` - Contact form (SendGrid)
- `api/quote/route.ts` - Quote submission (SendGrid)
- `api/upload/route.ts` - File uploads (Vercel Blob)
- `api/auth/[...nextauth]/route.ts` - Authentication
- `api/search/route.ts` - Product search
- `api/admin/products/route.ts` - Create product
- `api/admin/products/[id]/route.ts` - Update product
- `api/admin/products/[id]/videos/route.ts` - Product videos
- `api/admin/products/[id]/videos/[videoId]/route.ts` - Video CRUD
- `api/admin/products/[id]/videos/[videoId]/primary/route.ts` - Set primary video
- `api/admin/categories/route.ts` - Create category
- `api/admin/categories/[id]/route.ts` - Update/delete category
- `api/admin/brands/route.ts` - Create brand
- `api/admin/brands/[id]/route.ts` - Update/delete brand
- `api/admin/inventory/route.ts` - Inventory management
- `api/admin/inventory/batch/route.ts` - Bulk inventory updates
- `api/admin/inventory/variation/route.ts` - Variation updates
- `api/admin/pricing/route.ts` - Pricing management
- `api/admin/export/inventory/route.ts` - Export inventory data

## High-Impact Files

1. **src/app/layout.tsx** - Root layout, providers, metadata
2. **src/components/Header.tsx** - Site-wide navigation
3. **src/components/ProductCard.tsx** - Used on all product listings
4. **src/db/schema.ts** - Database structure (11 tables)
5. **src/context/QuoteContext.tsx** - Quote cart state
6. **next.config.js** - Image domains, redirects

## Security Files

Security implementations:
1. **src/lib/sanitize.ts** - XSS prevention utilities ✅
2. **src/lib/rate-limit.ts** - Upstash rate limiting ✅
3. **src/lib/turnstile.ts** - Turnstile verification ✅
4. **src/components/Turnstile.tsx** - CAPTCHA widget ✅
5. **api/contact/route.ts** - Uses sanitization + rate limiting + Turnstile ✅
6. **api/quote/route.ts** - Uses sanitization + rate limiting + Turnstile ✅
7. **api/upload/route.ts** - Needs ownership verification ⏳
8. **middleware.ts** - Auth protection scope

## Analytics

- **src/components/GoogleAnalytics.tsx** - GA4 tracking ✅
- **src/app/layout.tsx** - Analytics integration

## New Routes (since 2025-12-28)

- **src/app/about/page.tsx** - About page
- **src/app/bore-flex/page.tsx** - Bore-Flex brand page
- **src/app/brands/page.tsx** - All brands listing
- **src/app/delivery/page.tsx** - Delivery information
- **src/app/expansion-joints/page.tsx** - Expansion joints category
- **src/app/expansion-joints/[subcategory]/page.tsx** - Expansion joint subcategories
- **src/app/meet-the-team/page.tsx** - Team page
- **src/app/privacy/page.tsx** - Privacy policy
- **src/app/returns/page.tsx** - Returns policy
- **src/app/admin/pricing/page.tsx** - Pricing management (admin)

## New Components (since 2025-12-28)

- **src/components/BulkPricingTicker.tsx** - Bulk pricing display
- **src/components/GeoStock.tsx** - Geo-based stock messaging
- **src/components/ProductDetailClient.tsx** - Client-side product detail
- **src/components/SubcategoryTiles.tsx** - Subcategory navigation tiles
- **src/components/USPBar.tsx** - Unique selling points bar
- **src/components/admin/InventoryManagementTable.tsx** - Inventory table with bulk actions
- **src/components/admin/LogisticsTabs.tsx** - Shipping/supplier data tabs
- **src/components/admin/StatsCard.tsx** - Dashboard stat cards
- **src/components/admin/StockStatusBadge.tsx** - Stock status indicators
- **src/components/admin/VideoPopup.tsx** - Video management popup

## New Lib (since 2025-12-28)

- **src/lib/utils/size-sort.ts** - Size sorting utilities
