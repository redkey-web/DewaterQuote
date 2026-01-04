---
type: migration-plan
status: active
project: dewater-products
created: 2025-12-07
updated: 2025-12-14
source_framework: Vite + Express + Neto API
target_framework: Next.js 14 (App Router) + Vercel
---

# Migration Plan: deWater Products

## Project Info

- **Source Path**: /Users/redkey/Documents/NEXUS/RED-KEY/websites/DewaterQuote
- **Source Framework**: Vite + Express + wouter + Neto API
- **Target**: Next.js 14 (App Router) + Neon Postgres + Custom Admin + Vercel
- **Estimated Total**: 12-16 hours (multi-session)

## Codebase Summary

| Category | Count | Notes |
|----------|-------|-------|
| Pages | 13 | client/src/pages/ |
| Components | 72 | 50 UI (shadcn) + 22 custom |
| API Routes | 2 | Neto product search/detail |
| Total LOC | ~9,500 | All source files |

## Services

**Existing**: Neto API (product data)
**Adding**:
- Neon Postgres (database)
- Custom Admin Panel (product CMS)
- SendGrid (email for quotes)
- Cloudflare Turnstile (spam protection)
- Carrier API (shipping estimates)
- Vercel Blob (file storage)

## Expanded Feature Requirements

- [x] Product CMS (add/edit products, prices, lead times) ✅
- [x] PDF datasheet uploads per product ✅
- [x] Image management (product images, certifications) ✅
- [x] Category/tag system for products ✅
- [x] Industry classification ✅
- [x] Breadcrumb navigation ✅
- [x] Sitemap.xml generation ✅
- [x] robots.txt ✅
- [x] SEO metadata per page ✅
- [ ] Shipping cost estimation (Australia Post/Sendle API) - PENDING
- [x] Quote cart system (existing - port) ✅
- [x] Contact/Quote forms with email ✅ (mailto fallback)

---

## Phase 1: Analysis

Status: ✅ COMPLETE

- [x] Scan codebase structure
- [x] Count pages and components
- [x] Identify dependencies
- [x] Detect existing services
- [x] Calculate time estimate
- [x] Gather feature requirements

## Phase 2: Project Setup

Status: ✅ COMPLETE

- [x] Initialize Next.js 14 in `src/` (`npx create-next-app@latest`)
- [x] Configure TypeScript (`tsconfig.json`)
- [x] Set up path aliases (`@/*`)
- [x] Create app/ directory structure
- [x] Configure Tailwind CSS
- [x] Install shadcn/ui (47 components copied)
- [x] Create root layout.tsx
- [x] Verify: `npm run build` - SUCCESS

## Phase 3: Database Schema

Status: ✅ COMPLETE

> **Architecture Document**: [database-architecture.md](./database-architecture.md)
> Full technical specification including schema, queries, and implementation details.

### Stack Decision (from architecture analysis)

| Component | Choice | Status |
|-----------|--------|--------|
| Database | Neon Postgres | ✅ Connected |
| ORM | Drizzle ORM | ✅ Configured |
| File Storage | Vercel Blob | ✅ API Ready |
| Auth | NextAuth.js | ✅ Configured |

### 3.1 Neon Postgres Setup (30 min) ✅
- [x] Create Neon project
- [x] Copy connection string to `.env.local`
- [x] Add `DATABASE_URL` to Vercel environment variables
- [x] Test connection with `npm run db:studio`

### 3.2 Schema Implementation (2 hr) ✅
- [x] Create `src/db/schema.ts` with all tables:
  - brands, categories, subcategories
  - products (main table with JSONB materials)
  - productVariations (size/price options)
  - productImages, productDownloads
  - productFeatures, productSpecifications, productApplications
  - adminUsers (for NextAuth)
- [x] Create `src/db/index.ts` (Drizzle + Neon client)
- [x] Create `drizzle.config.ts` for Neon
- [x] Add db scripts to package.json (db:generate, db:push, db:studio)
- [x] Run `npm run db:push` to create tables
- [x] Verify tables exist (11 tables)

### 3.3 Seed Data (2-3 hr) ✅
- [x] Create `scripts/seed.ts`
- [x] Transform `catalog.ts` products to DB inserts
- [x] Handle all relationships (brand → product → variations → images)
- [x] Run seed: `npm run db:seed`
- [x] Verify data: 7 brands, 6 categories, 16 subcategories, 31 products, 412 variations, 60 images

### 3.4 Data Access Layer (1-2 hr) ✅
- [x] Create `src/lib/db/products.ts` with query functions
- [x] Create `src/lib/db/categories.ts`
- [x] Pages use DB queries with catalog.ts as fallback
- [x] Keep `catalog.ts` as fallback during transition

## Phase 4: Core Infrastructure

Status: ✅ COMPLETE

- [x] Port global styles to `app/globals.css`
- [x] Port Navigation/Header component
- [x] Port Footer component
- [x] Port shared UI components from shadcn (47 components)
- [x] Create `lib/utils.ts`
- [x] Create `lib/quote.ts` (quote utilities)
- [x] Create `types/index.ts` (shared types)
- [x] Create QuoteContext provider
- [x] Port QuoteCart component
- [x] Port StickyQuoteButton component
- [x] Create AppProviders wrapper
- [x] Update layout.tsx with providers
- [x] Install nanoid dependency
- [x] Verify: `npm run build` - SUCCESS
- [x] Create `lib/db.ts` (database client) - Done in Phase 3 as `src/db/index.ts`

## Phase 5: Page Migration

Status: ✅ COMPLETE

### Pages to Port

**Main Pages:**
- [x] HomePage.tsx → app/page.tsx
- [x] ProductRangePage.tsx → app/products/page.tsx
- [x] ContactPage.tsx → app/contact/page.tsx
- [x] RequestQuotePage.tsx → app/request-quote/page.tsx
- [x] not-found.tsx → app/not-found.tsx

**Category Pages:**
- [x] ClampsCouplingsPage.tsx → app/pipe-couplings/page.tsx
- [x] ValvesPage.tsx → app/valves/page.tsx
- [x] ExpansionJointsPage.tsx → app/rubber-expansion-joints/page.tsx
- [x] StrainersPage.tsx → app/strainers/page.tsx

**Dynamic Pages:**
- [x] ProductDetailPage.tsx → app/products/[slug]/page.tsx
- [x] ProductListPage.tsx → (merged into category pages)
- [x] BrandPage.tsx → app/brands/[brand]/page.tsx
- [x] IndustryPage.tsx → app/industries/[industry]/page.tsx

### Components Ported
- [x] TypewriterText.tsx → src/components/TypewriterText.tsx
- [x] ProductCard.tsx → src/components/ProductCard.tsx
- [x] Header.tsx → src/components/Header.tsx
- [x] Footer.tsx → src/components/Footer.tsx
- [x] QuoteCart.tsx → src/components/QuoteCart.tsx
- [x] StickyQuoteButton.tsx → src/components/StickyQuoteButton.tsx
- [x] JsonLd.tsx → src/components/JsonLd.tsx (new for SEO)

### Components to Port (Future)
- [ ] Hero.tsx (inline in pages for now)
- [ ] AnnouncementBanner.tsx
- [ ] CategorySection.tsx (inline in pages)
- [ ] TrustMetrics.tsx
- [ ] BrandSection.tsx (inline in pages)
- [ ] IndustrySection.tsx (inline in pages)
- [ ] AppSidebar.tsx (not needed - using different layout)

### SSR Best Practices ✅
- [x] Pages are SERVER components by default
- [x] Only `'use client'` on interactive components (QuoteCart, ProductCard)
- [x] Export `generateMetadata` for SEO on pages
- [x] Using `<Link>` from next/link for internal links
- [ ] Convert `<img>` to `<Image>` from next/image (optimization pass)

## Phase 6: Quote Cart System

Status: ✅ COMPLETE (ported in Phase 4)

- [x] Port QuoteCart.tsx (already functional)
- [x] Port quote context/state management (QuoteContext.tsx)
- [x] Port localStorage persistence
- [x] Port StickyQuoteButton
- [x] Port add-to-quote functionality
- [x] Verify cart works across pages

## Phase 7: Admin Panel

Status: ✅ COMPLETE

> **Architecture Document**: [database-architecture.md](./database-architecture.md)
> See Admin Authentication and File Storage sections for implementation details.

### 7.1 Auth Setup (1-2 hr) ✅
- [x] Install bcryptjs: `npm install bcryptjs @types/bcryptjs`
- [x] Create `src/app/api/auth/[...nextauth]/route.ts` (credentials provider)
- [x] Create `src/middleware.ts` for `/admin/*` protection
- [x] Create `/admin/login` page with shadcn form
- [x] Create `src/lib/auth/config.ts` with credentials provider
- [x] Create initial admin user via seed script
- [x] Admin user exists: sales@dewaterproducts.com.au

### 7.2 Admin Layout (1-2 hr) ✅
- [x] Create `src/app/admin/layout.tsx` with sidebar navigation
- [x] Create `src/app/admin/page.tsx` (dashboard)
- [x] Navigation items: Dashboard, Products, Categories, Brands, Files
- [x] Create `src/components/admin/AdminSidebar.tsx`
- [x] Create `src/components/admin/AdminHeader.tsx`
- [x] Add logout button

### 7.3 Product Management (3-4 hr) ✅
- [x] Products list page `/admin/products` with DataTable
- [x] Product create form `/admin/products/new`
- [x] Product edit form `/admin/products/[id]`
- [x] Create `src/components/admin/ProductForm.tsx` with fields:
  - Basic: name, shortName, slug (auto-generate), SKU
  - Relations: brand (select), category (select), subcategory (select)
  - Content: description (textarea), certifications (markdown)
  - Technical: materials (JSON editor), pressureRange, temperature, sizeFrom
  - Pricing: priceVaries (toggle), basePrice, priceNote
  - Meta: leadTime, video URL, isActive toggle
- [x] Variation management (inline table: size, label, price, sku)
- [x] Create `src/components/admin/ImageUpload.tsx` (Vercel Blob) with drag-drop
- [x] Create `src/components/admin/FileUpload.tsx` (PDF datasheet upload)
- [x] Features list (add/remove/reorder)
- [x] Specifications list (label/value pairs)
- [x] Applications list
- [x] Create `src/app/api/admin/products/[id]/route.ts` (GET/PUT/DELETE)
- [x] Delete product functionality with confirmation dialog
- [x] ProductFormNew includes Images & Files tab

### 7.4 Category/Brand Management (1-2 hr) ✅
- [x] Categories list page `/admin/categories`
- [x] Category create/edit form (name, slug, description, image)
- [x] Subcategories management (nested under category)
- [x] Brands list page `/admin/brands`
- [x] Brand create/edit form

### 7.5 File Management (1 hr) ✅
- [x] Create `src/app/api/upload/route.ts` (Vercel Blob)
- [x] Delete endpoint in upload route
- [x] ImageUpload component for admin
- [x] FileUpload component for admin
- [x] Image preview and deletion
- [x] Files browser page `/admin/files` (view all images/documents)
- [x] Settings page `/admin/settings` (account info, service status)

## Phase 8: Shipping Integration

Status: PENDING

### 8.1 Carrier API Research
- [ ] Evaluate Australia Post API
- [ ] Evaluate Sendle API
- [ ] Choose provider based on requirements

### 8.2 Implementation
- [ ] Create shipping estimate API route
- [ ] Add product dimensions/weight fields
- [ ] Implement zone lookup
- [ ] Add to quote cart UI
- [ ] Handle errors gracefully

## Phase 9: SEO & Content

Status: ✅ COMPLETE

- [x] Add generateMetadata to all pages
- [x] Configure Open Graph metadata in layout.tsx
- [x] Add JSON-LD schema (Organization, Product, BreadcrumbList)
- [x] Create sitemap.ts (dynamic sitemap generation)
- [x] Create robots.ts
- [x] Implement breadcrumb component (BreadcrumbJsonLd)
- [ ] Add canonical URLs (optional enhancement)
- [ ] Add Open Graph images (optional enhancement)

## Phase 10: Services Integration

Status: ✅ COMPLETE

### Email (SendGrid Ready)
- [x] Contact form uses SendGrid API (with fallback error handling)
- [x] Quote form uses SendGrid API (with fallback error handling)
- [x] SendGrid API routes with XSS sanitization + rate limiting
- [x] Cloudflare Turnstile integrated (pending env vars)
- [x] Security headers (CSP, X-Frame-Options, etc.)

## Phase 11: Testing

Status: ✅ COMPLETE

- [x] All pages load correctly
- [x] All navigation links work
- [x] Quote cart functionality works
- [x] Forms open email client correctly
- [x] Brand pages show products (Orbit, Straub, Teekay)
- [x] Industry pages work
- [x] SEO verified (sitemap, robots.txt)
- [x] `npm run build` succeeds with no errors

## Phase 12: Vercel Deployment

Status: ✅ COMPLETE

- [x] Link Vercel project (`vercel link`)
- [x] Configure environment variables (CONTACT_EMAIL, FROM_EMAIL)
- [x] Deploy production (`vercel --prod`)
- [x] Live at: https://dewater-products.vercel.app

## Phase 13: Cleanup

Status: ✅ COMPLETE

- [x] No deprecated Vite/Express code (clean Next.js project)
- [x] No old scripts in package.json
- [x] .gitignore is clean
- [x] Final build verification ✅
- [x] Clean directory structure

---

## Environment Variables Setup

Status: ✅ COMPLETE

> **Files**: `.env.local` (secrets), `.env.example` (template)

### Required Variables

| Variable | Service | Where to Get | Required For |
|----------|---------|--------------|--------------|
| `SENDGRID_API_KEY` | SendGrid | [API Keys](https://app.sendgrid.com/settings/api_keys) | Email forms |
| `CONTACT_EMAIL` | - | Your email | Form recipient |
| `FROM_EMAIL` | - | Your email | Form sender |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare | [Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) | Spam protection |
| `TURNSTILE_SECRET_KEY` | Cloudflare | Same as above | Spam protection |
| `DATABASE_URL` | Neon | [Console](https://console.neon.tech) or Vercel Marketplace | Phase 3 |
| `NEXTAUTH_SECRET` | - | `openssl rand -base64 32` | Phase 7 |
| `NEXTAUTH_URL` | - | Your domain URL | Phase 7 |
| `BLOB_READ_WRITE_TOKEN` | Vercel | Vercel Dashboard > Storage | File uploads |

### Vercel Environment Variables

Set these in Vercel Dashboard > Settings > Environment Variables:
- [x] `SENDGRID_API_KEY` ✅
- [x] `CONTACT_EMAIL` ✅
- [x] `FROM_EMAIL` ✅
- [x] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` ✅
- [x] `TURNSTILE_SECRET_KEY` ✅
- [x] `DATABASE_URL` (auto-set by Neon integration) ✅
- [x] `NEXTAUTH_SECRET` ✅
- [x] `NEXTAUTH_URL` (production URL) ✅
- [x] `BLOB_READ_WRITE_TOKEN` (auto-set by Vercel Blob) ✅

---

## Issues Log

| Date | Issue | Status | Resolution |
|------|-------|--------|------------|

---

## Session Log

| Date | Phase | Work Done | Time |
|------|-------|-----------|------|
| 2025-12-07 | Analysis | Full scope gathering, plan creation | - |
| 2025-12-07 | 2,4,5,6 | Project setup, infrastructure, page migration, quote cart | - |
| 2025-12-07 | 9 | SEO (sitemap, robots.txt, JSON-LD) | - |
| 2025-12-07 | 10 | Email forms (mailto fallback) | - |
| 2025-12-07 | 11 | Testing all pages and functionality | - |
| 2025-12-07 | 12 | Vercel deployment | - |
| 2025-12-07 | 13 | Cleanup, archive old code | - |
| 2025-12-11 | 7 | Admin polish: ProductFormNew media tab, delete functionality | - |
| 2025-12-11 | Security | Fixed middleware to protect /admin route, verified production | - |
| 2025-12-11 | 7.5 | Added Files browser page and Settings page to admin panel | - |
| 2025-12-11 | 10 | Security hardening: Turnstile, SendGrid API integration, CSP headers | - |
| 2025-12-14 | SEO | GA4 integration, root-level URLs, redirect mapping | - |
| 2025-12-14 | SEO | Favicon, OG image, apple icon, alt tags | - |
| 2025-12-28 | Merge | Replit UI changes merged, SEO verified intact | - |
| 2025-12-28 | Align | hosting.md updated, production status confirmed | - |

---

## Remaining Work

The following features are pending:
- **Phase 8**: Shipping Integration - carrier API research & implementation
- **Feature**: Download Price List PDF button (currently non-functional)

### Environment Variables
All environment variables are now configured in Vercel. ✅

See `.planning/current/SETUP_GUIDE.md` for setup instructions.

---

## Future Enhancements

Features to add when client requests:

### Download Price List PDF
- [ ] Create price list PDF generation (server-side or static upload)
- [ ] Wire up "Download Price List" button on /contact page
- [ ] Option: Static PDF uploaded to Vercel Blob
- [ ] Option: Dynamic PDF generated from product database

### Admin User Management (Settings Page)
Currently admin users are created via CLI script. Future enhancement:
- [ ] Change password form in Settings page (no CLI needed)
- [ ] Add/remove admin users via portal UI
- [ ] User roles (admin, editor, viewer)
- [ ] Activity log / audit trail

### Other Enhancements
- [ ] Convert `<img>` to `<Image>` from next/image (optimization)
- [ ] Add canonical URLs to pages
- [x] Add Open Graph images for social sharing ✅ (opengraph-image.tsx)

### DNS Cutover (When Ready)
- [ ] Add dewaterproducts.com.au in Vercel Dashboard
- [ ] Update DNS records at registrar
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Verify SSL and redirects work

---

Last Updated: 2026-01-04 (refreshed via webdev:refresh)
