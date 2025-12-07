---
type: migration-plan
status: complete
project: dewater-products
created: 2025-12-07
updated: 2025-12-07
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

- [ ] Product CMS (add/edit products, prices, lead times)
- [ ] PDF datasheet uploads per product
- [ ] Image management (product images, certifications)
- [ ] Category/tag system for products
- [ ] Industry classification
- [ ] Breadcrumb navigation
- [ ] Sitemap.xml generation
- [ ] robots.txt
- [ ] SEO metadata per page
- [ ] Shipping cost estimation (Australia Post/Sendle API)
- [ ] Quote cart system (existing - port)
- [ ] Contact/Quote forms with email

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

Status: PENDING

> **Architecture Document**: [database-architecture.md](./database-architecture.md)
> Full technical specification including schema, queries, and implementation details.

### Stack Decision (from architecture analysis)

| Component | Choice | Status |
|-----------|--------|--------|
| Database | Neon Postgres | ✅ Already in package.json |
| ORM | Drizzle ORM | ✅ Already in package.json |
| File Storage | Vercel Blob | ✅ Already in package.json |
| Auth | NextAuth.js | ✅ Already in package.json |

### 3.1 Neon Postgres Setup (30 min)
- [ ] Create Neon project via Vercel Marketplace integration
- [ ] Copy connection string to `.env.local`
- [ ] Add `DATABASE_URL` to Vercel environment variables
- [ ] Test connection with `npm run db:studio`

### 3.2 Schema Implementation (2 hr)
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
- [ ] Run `npm run db:push` to create tables (waiting for DATABASE_URL)
- [ ] Verify tables in Drizzle Studio

### 3.3 Seed Data (2-3 hr)
- [x] Create `scripts/seed.ts`
- [x] Transform `catalog.ts` products to DB inserts
- [x] Handle all relationships (brand → product → variations → images)
- [ ] Run seed: `npm run db:seed` (waiting for DATABASE_URL)
- [ ] Verify data in Drizzle Studio (22 products, 3 brands, 6 categories)

### 3.4 Data Access Layer (1-2 hr)
- [x] Create `src/lib/db/products.ts` with query functions
- [x] Create `src/lib/db/categories.ts`
- [ ] Update existing pages to use DB queries (after seed completes)
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
- [ ] Create `lib/db.ts` (database client) - Deferred to Phase 3

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

Status: PENDING

> **Architecture Document**: [database-architecture.md](./database-architecture.md)
> See Admin Authentication and File Storage sections for implementation details.

### 7.1 Auth Setup (1-2 hr)
- [ ] Install bcryptjs: `npm install bcryptjs @types/bcryptjs`
- [ ] Create `src/app/api/auth/[...nextauth]/route.ts` (credentials provider)
- [ ] Create `src/middleware.ts` for `/admin/*` protection
- [ ] Create `/admin/login` page with shadcn form
- [ ] Create initial admin user via seed script
- [ ] Test login flow

### 7.2 Admin Layout (1-2 hr)
- [ ] Create `src/app/admin/layout.tsx` with sidebar navigation
- [ ] Create `src/app/admin/page.tsx` (dashboard)
- [ ] Navigation items: Dashboard, Products, Categories, Brands, Files
- [ ] Use shadcn sidebar component
- [ ] Add logout button

### 7.3 Product Management (3-4 hr)
- [ ] Products list page `/admin/products` with DataTable
- [ ] Product create form `/admin/products/new`
- [ ] Product edit form `/admin/products/[id]`
- [ ] Form fields:
  - Basic: name, shortName, slug (auto-generate), SKU
  - Relations: brand (select), category (select), subcategory (select)
  - Content: description (textarea), certifications (markdown)
  - Technical: materials (JSON editor), pressureRange, temperature, sizeFrom
  - Pricing: priceVaries (toggle), basePrice, priceNote
  - Meta: leadTime, video URL, isActive toggle
- [ ] Variation management (inline table: size, label, price, sku)
- [ ] Image upload (Vercel Blob) with drag-drop
- [ ] PDF datasheet upload (Vercel Blob)
- [ ] Features list (add/remove/reorder)
- [ ] Specifications list (label/value pairs)
- [ ] Applications list

### 7.4 Category/Brand Management (1-2 hr)
- [ ] Categories list page `/admin/categories`
- [ ] Category create/edit form (name, slug, description, image)
- [ ] Subcategories management (nested under category)
- [ ] Brands list page `/admin/brands`
- [ ] Brand create/edit form

### 7.5 File Management (1 hr)
- [ ] Create `src/app/api/upload/route.ts` (Vercel Blob)
- [ ] Create `src/app/api/upload/delete/route.ts`
- [ ] File browser component for admin
- [ ] Image preview and deletion

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

Status: ✅ COMPLETE (mailto fallback)

### Email (mailto fallback)
- [x] Contact form opens email client with pre-filled data
- [x] Quote form opens email client with detailed quote items
- [x] SendGrid API routes preserved for future use
- [ ] Cloudflare Turnstile (deferred - optional)

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

- [x] Move deprecated Vite/Express code to `_deprecated/`
- [x] Remove old scripts from package.json
- [x] Update .gitignore
- [x] Final build verification
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
- [ ] `SENDGRID_API_KEY`
- [ ] `CONTACT_EMAIL`
- [ ] `FROM_EMAIL`
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- [ ] `TURNSTILE_SECRET_KEY`
- [ ] `DATABASE_URL` (auto-set by Neon integration)
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL` (production URL)
- [ ] `BLOB_READ_WRITE_TOKEN` (auto-set by Vercel Blob)

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

---

## Deferred Features

The following features are ready to implement when needed:
- **Phase 3**: Database (Neon Postgres + Drizzle) - schema designed
- **Phase 7**: Admin Panel - for product CMS
- **Phase 8**: Shipping Integration - carrier API
- **SendGrid**: API routes exist, needs domain verification

---

Last Updated: 2025-12-07
