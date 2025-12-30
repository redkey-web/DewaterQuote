# DeWater Products - Quote Request System

## Overview

Industrial pipe fittings e-commerce/quote system for DeWater Products Australia. Customers browse products, add items to a quote cart, and submit quote requests via email. This is a B2B-focused platform serving water, wastewater, mining, and irrigation industries.

- **Production URL**: https://dewaterproducts.com.au
- **Framework**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL + Drizzle ORM

## User Preferences

Preferred communication style: Simple, everyday language.

---

## REPLIT AI: CAPABILITIES & LIMITATIONS

### What Replit AI CAN Do

- Edit source code (components, pages, styles)
- Run `npm run dev` for local development
- Run `npm run build` to test builds
- Run `npm run lint` for code quality
- View and edit configuration files
- Create new components and pages
- Fix TypeScript errors
- Refactor code

### What Replit AI CANNOT Do

| Operation | Reason | Alternative |
|-----------|--------|-------------|
| Run `npx tsx scripts/*.ts` | No DATABASE_URL access | Use handoff protocol |
| Upload to Vercel Blob | No BLOB_READ_WRITE_TOKEN | Use handoff protocol |
| Run `drizzle-kit push` | No DATABASE_URL access | Use handoff protocol |
| Run `drizzle-kit generate` | No DATABASE_URL access | Use handoff protocol |
| Deploy to Vercel | No Vercel token | Push to git, auto-deploys |
| Modify production data | No DB access | Use handoff protocol |

### Handoff Protocol for DB Operations

When you need to perform database operations, create a handoff request:

1. **Create a JSON file** in `_handoff/pending/`
2. **Name it** descriptively: `{timestamp}-{operation}.json`
3. **Follow the format** in `_handoff/README.md`
4. **Commit and push** to main branch
5. **Claude Code** will process and move to `_handoff/completed/`

#### Example: Add New Product

```json
// _handoff/pending/2025-01-01-add-new-valve.json
{
  "operation": "create_product",
  "priority": "normal",
  "data": {
    "name": "New Butterfly Valve",
    "slug": "new-butterfly-valve",
    "sku": "NBV-001",
    "brandId": 1,
    "categoryId": 1,
    "description": "A new butterfly valve product...",
    "priceVaries": true,
    "variations": [
      { "size": "50mm", "label": "DN50", "price": "125.00" }
    ]
  },
  "notes": "New product requested by client",
  "createdBy": "replit-ai",
  "createdAt": "2025-01-01T10:00:00Z"
}
```

### How to Prepare Product Data

When preparing product data for the handoff:

1. **Required fields**: name, slug, sku, brandId, categoryId, description
2. **Look up IDs**: Check existing brands/categories in `src/data/catalog.ts` for reference
3. **Slug format**: lowercase, hyphenated (e.g., `new-product-name`)
4. **SKU format**: uppercase (e.g., `NPR-001`)

#### Brand IDs (current)
- 1 = Orbit
- 2 = Straub
- 3 = Teekay

#### Category IDs (current)
- 1 = valves
- 2 = pipe-couplings
- 3 = pipe-repair-clamps
- 4 = strainers
- 5 = rubber-expansion-joints
- 6 = flange-adaptors

---

## System Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 15 | App Router with Server Components |
| Language | TypeScript | Strict mode enabled |
| Styling | Tailwind CSS | With CSS variables for theming |
| Components | shadcn/ui | Radix primitives (47 UI components) |
| Database | Neon PostgreSQL | Serverless Postgres |
| ORM | Drizzle | Type-safe database queries |
| Auth | NextAuth.js | Admin panel authentication |
| Forms | React Hook Form + Zod | Validation |

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (contact, quote, upload, auth)
│   ├── admin/             # Admin panel (protected routes)
│   ├── products/          # Product pages
│   └── [slug]/            # Dynamic product routes
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── context/               # React Context (QuoteContext)
├── data/                  # Static catalog data (catalog.ts) - READ ONLY REFERENCE
├── db/                    # Database schema and connection
├── lib/                   # Utilities and helpers
└── types/                 # TypeScript type definitions
```

### Key Architecture Decisions

**App Router Pattern**: Uses Next.js 15 App Router exclusively. Server Components by default, `'use client'` directive only when hooks, events, or context are needed.

**Quote Cart System**: Client-side state managed via React Context (`QuoteContext`), persisted to localStorage. No user accounts required - quote requests submitted via email.

**Database Schema**: Products, categories, brands, and variations stored in Neon Postgres. Schema defined in `src/db/schema.ts`, queries in `src/data/products.ts`.

**Database is Single Source of Truth**: The `catalog.ts` file is READ-ONLY reference. All live data comes from the database. Do not modify catalog.ts for production data changes.

### Important Constraints

This project was migrated from Vite/Express. Only use Next.js patterns:

- Use `next/link` for navigation (not wouter)
- Use `next/image` for images
- API routes in `src/app/api/` (not Express)
- No `client/`, `server/`, or `shared/` directories (legacy, now in `_replit_backup/`)

---

## Product Data Rules

### Adding Products (via handoff)

1. **Never duplicate SKUs** - Each product needs unique SKU
2. **Never duplicate slugs** - Each product needs unique URL slug
3. **Brand must exist** - Use existing brandId (1, 2, or 3)
4. **Category must exist** - Use existing categoryId (1-6)
5. **Images uploaded separately** - Include Blob URLs in handoff, or note that images need uploading

### Editing Products

For minor text changes (description, features), you can prepare the handoff.
For structural changes (new categories, schema changes), note this in handoff for Claude to evaluate.

### Price Updates

Prices are stored in `product_variations` table. To update:
```json
{
  "operation": "update_prices",
  "data": {
    "productSku": "OFG-SS",
    "variations": [
      { "size": "48.3mm", "newPrice": "49.95" }
    ]
  }
}
```

---

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless database via `@neondatabase/serverless`
- **Drizzle ORM**: Schema in `src/db/schema.ts`, config in `drizzle.config.ts`
- **Env**: `DATABASE_URL` (NOT available in Replit)

### Email
- **SendGrid**: Quote and contact form submissions via `@sendgrid/mail`
- **Env**: `SENDGRID_API_KEY`, `FROM_EMAIL`, `BUSINESS_EMAIL`

### Authentication
- **NextAuth.js**: Admin panel access with credentials provider
- **Env**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_PASSWORD_HASH`

### File Storage
- **Vercel Blob**: PDF datasheets and product images
- **Env**: `BLOB_READ_WRITE_TOKEN` (NOT available in Replit)

### Spam Protection
- **Cloudflare Turnstile**: Form protection on contact and quote pages
- **Env**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

### Rate Limiting
- **Upstash Redis**: API rate limiting
- **Env**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

### Analytics
- **Google Analytics 4**: Tracking via `src/components/GoogleAnalytics.tsx`
- **Measurement ID**: `G-6KZKZBD747`

---

## Quick Reference

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npm run lint
```

### For DB/Blob Operations
Create handoff request in `_handoff/pending/` - see protocol above.
