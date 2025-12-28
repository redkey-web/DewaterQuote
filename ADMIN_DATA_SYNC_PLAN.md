# Admin Panel Data Sync Plan

## Executive Summary

The admin panel currently edits database records, but the public site reads from a static TypeScript file (`catalog.ts`). These are completely disconnected. Admin changes have no effect on the live site.

**Goal**: Make admin panel fully functional - edits affect live site, existing data is prefilled for editing, new products can be added.

---

## Current Architecture (Broken)

```
┌─────────────────┐         ┌─────────────────┐
│  catalog.ts     │         │   Database      │
│  (static file)  │         │   (Neon)        │
└────────┬────────┘         └────────┬────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Public Site    │         │  Admin Panel    │
│  /[slug]/page   │         │  /admin/*       │
└─────────────────┘         └─────────────────┘
         │                           │
         └───── DISCONNECTED ────────┘
```

### Data Sources

| Source | Location | Contains | Used By |
|--------|----------|----------|---------|
| `catalog.ts` | `src/data/catalog.ts` | 31 products with clean description, features[], specs[], images, variations | Public product pages |
| Database | Neon Postgres | Same products but: description has HTML with features embedded, features[] empty, specs[] empty | Admin panel |

### The Problems

1. **Admin edits don't affect live site** - Public pages read static file, not database
2. **Features/Specs missing in admin** - Database wasn't properly seeded with separated data
3. **Description contains embedded HTML** - Legacy Neto import put everything in description field
4. **Preview doesn't match live** - Preview shows DB state (empty features), live shows catalog.ts (has features)

---

## Target Architecture (Fixed)

```
┌─────────────────────────────────────┐
│           Database (Neon)           │
│  - Clean descriptions               │
│  - Populated features[]             │
│  - Populated specifications[]       │
│  - All product data                 │
└──────────────────┬──────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌─────────────────┐ ┌─────────────────┐
│  Public Site    │ │  Admin Panel    │
│  /[slug]/page   │ │  /admin/*       │
│  (reads from DB)│ │  (edits DB)     │
└─────────────────┘ └─────────────────┘
         │                   │
         └─── CONNECTED ─────┘
```

---

## Implementation Phases

### Phase 1: Data Migration (Sync catalog.ts → Database)

**Purpose**: Populate database with properly structured data from catalog.ts

**Tasks**:
1. Create migration script: `scripts/sync-catalog-to-db.ts`
2. For each product in catalog.ts:
   - Update description to clean text (no HTML)
   - Insert features into `product_features` table
   - Insert specifications into `product_specifications` table
   - Ensure images, variations, applications are synced
3. Run migration against production database
4. Verify data in admin panel

**Script Logic**:
```typescript
// Pseudocode
for (product of catalogProducts) {
  // Find matching DB product by slug
  const dbProduct = await db.query.products.findFirst({ where: eq(products.slug, product.slug) });

  if (dbProduct) {
    // Update description (clean, no HTML)
    await db.update(products).set({ description: product.description });

    // Delete existing features, insert from catalog
    await db.delete(productFeatures).where(eq(productFeatures.productId, dbProduct.id));
    for (feature of product.features) {
      await db.insert(productFeatures).values({ productId: dbProduct.id, feature });
    }

    // Same for specifications, applications
  }
}
```

**Estimated Effort**: 2-3 hours

---

### Phase 2: Update Public Pages to Read from Database

**Purpose**: Make public site read from database so admin edits take effect

**Files to Modify**:

| File | Current | Change To |
|------|---------|-----------|
| `src/app/[slug]/page.tsx` | `getProductBySlug` from catalog.ts | Fetch from database via API or direct query |
| `src/app/pipe-couplings/page.tsx` | Reads catalog.ts | Fetch from database |
| `src/app/valves/page.tsx` | Reads catalog.ts | Fetch from database |
| `src/app/rubber-expansion-joints/page.tsx` | Reads catalog.ts | Fetch from database |
| `src/app/strainers/page.tsx` | Reads catalog.ts | Fetch from database |
| `src/app/brands/[brand]/page.tsx` | Reads catalog.ts | Fetch from database |
| `src/app/industries/[industry]/page.tsx` | Reads catalog.ts | Fetch from database |
| All category pages | Reads catalog.ts | Fetch from database |

**Approach Options**:

**Option A: Direct Database Queries (Recommended)**
- Create `src/data/products.ts` with functions like `getProductBySlug()`, `getProductsByCategory()`
- These query the database directly using Drizzle
- Replace catalog.ts imports with new data layer

**Option B: API Routes**
- Create `/api/products/[slug]` endpoint
- Public pages fetch from API
- More network overhead but cleaner separation

**Recommendation**: Option A - direct queries are faster and Next.js handles caching

**New Data Layer** (`src/data/products.ts`):
```typescript
import { db } from '@/db';
import { products, productFeatures, productImages, etc } from '@/db/schema';

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      features: true,
      specifications: true,
      images: true,
      variations: true,
      brand: true,
      category: true,
    }
  });
}

export async function getProductsByCategory(categorySlug: string) {
  // Query products by category
}

export async function getAllProducts() {
  // For sitemap, product listing
}
```

**Estimated Effort**: 4-6 hours

---

### Phase 3: Verify Admin Features Work

**Purpose**: Ensure full CRUD operations work end-to-end

**Test Cases**:
1. Edit existing product → changes appear on live site
2. Add new product via admin → appears on live site
3. Delete product → removed from live site
4. Upload images → display correctly
5. Edit features/specs → render correctly on product page

**Already Implemented**:
- ✅ Admin authentication (NextAuth)
- ✅ Product list view
- ✅ Product edit form (all fields)
- ✅ Product create form
- ✅ Product delete
- ✅ Image upload (Vercel Blob)
- ✅ File upload (PDFs)
- ✅ Preview tab (now matches site layout)
- ✅ HTML stripping from description

**Needs Verification After Phase 2**:
- Create new product → appears on public site
- Edit product → changes reflect immediately
- SEO (sitemap, JSON-LD) uses database data

**Estimated Effort**: 1-2 hours

---

### Phase 4: Cleanup

**Purpose**: Remove deprecated code and ensure consistency

**Tasks**:
1. Keep `catalog.ts` as backup/reference (rename to `catalog.backup.ts`)
2. Update sitemap.ts to use database
3. Update JSON-LD generation to use database
4. Remove unused catalog imports
5. Add database seeding script for fresh installs

**Estimated Effort**: 1 hour

---

## Database Schema Reference

Current schema supports all needed fields:

```sql
-- products table
products (
  id, slug, sku, name, shortName, brandId, categoryId, subcategoryId,
  description, certifications, materials, pressureRange, temperature,
  sizeFrom, leadTime, video, priceVaries, priceNote, basePrice, isActive
)

-- Related tables (already exist)
product_features (id, productId, feature, displayOrder)
product_specifications (id, productId, label, value, displayOrder)
product_images (id, productId, url, alt, isPrimary, displayOrder)
product_downloads (id, productId, url, label, fileType, fileSize)
product_variations (id, productId, size, label, price, sku, source, displayOrder)
product_applications (id, productId, application, displayOrder)
product_categories (id, productId, categoryId) -- junction for multi-category
```

---

## Files Summary

### To Create
- `scripts/sync-catalog-to-db.ts` - Migration script
- `src/data/products.ts` - New database data layer

### To Modify
- `src/app/[slug]/page.tsx` - Use database instead of catalog
- `src/app/*/page.tsx` - All category/brand pages (use database)
- `src/app/sitemap.ts` - Use database
- `src/components/JsonLd.tsx` - Verify works with DB data

### To Keep (Reference)
- `src/data/catalog.ts` → Rename to `catalog.backup.ts`

### Already Done (This Session)
- ✅ `src/lib/utils.ts` - Added `stripHtml()` function
- ✅ `src/components/admin/ProductForm.tsx` - Clean copy input, preview tab, save behavior
- ✅ `src/components/admin/ProductFormNew.tsx` - Same updates

---

## Estimated Total Effort

| Phase | Task | Hours |
|-------|------|-------|
| 1 | Data Migration Script | 2-3 |
| 2 | Update Public Pages | 4-6 |
| 3 | Verify & Test | 1-2 |
| 4 | Cleanup | 1 |
| **Total** | | **8-12 hours** |

---

## Quick Start for Implementation

```bash
# 1. Create and run migration script
npx tsx scripts/sync-catalog-to-db.ts

# 2. Verify data in admin
open http://localhost:3000/admin/products

# 3. Update public pages to use database
# Start with [slug]/page.tsx as the main product page

# 4. Test end-to-end
# Edit a product in admin → verify change on public site
```

---

## Success Criteria

- [ ] Admin edits product → Live site shows changes immediately
- [ ] Admin creates new product → Appears on live site
- [ ] Admin deletes product → Removed from live site
- [ ] All existing products have features/specs populated
- [ ] Description fields contain clean text only (no HTML)
- [ ] Preview matches live site layout exactly
- [ ] Sitemap includes all database products
- [ ] SEO (JSON-LD) works with database data
