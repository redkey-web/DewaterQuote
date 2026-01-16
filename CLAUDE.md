# DewaterQuote - Claude Code Instructions

## Project Overview

Industrial pipe fittings quote system for DeWater Products Australia. Next.js 15 with Neon PostgreSQL database.

- **Production**: https://dewaterproducts.com.au (Vercel)
- **Database**: Neon PostgreSQL (Vercel-integrated)
- **Images**: Vercel Blob storage
- **Admin**: /admin (NextAuth protected)

## Critical Rules

### Database is Single Source of Truth

- **NO FALLBACKS** - If DB fails, errors are thrown (not silently hidden)
- catalog.ts exists only for: build-time static generation, client-side suggestions
- All product operations go through the database

### Required Environment Variables

```bash
DATABASE_URL          # Neon PostgreSQL connection string
BLOB_READ_WRITE_TOKEN # Vercel Blob storage
NEXTAUTH_SECRET       # Admin auth
```

---

## Product Data Architecture

### Database Schema Overview

```
brands (3 records: Orbit, Straub, Teekay)
  └── products (67+ products)
        ├── product_variations (size/price options)
        ├── product_images (Blob URLs)
        ├── product_features (bullet points)
        ├── product_specifications (label/value pairs)
        ├── product_applications (use cases)
        └── product_downloads (PDF datasheets)

categories (7: valves, pipe-couplings, etc.)
  └── subcategories (11: butterfly-valve, y-strainer, etc.)
```

### Product Table Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `slug` | text | **YES** | URL path, unique, lowercase-hyphenated |
| `sku` | text | **YES** | Unique product code (e.g., "OFG-SS") |
| `name` | text | **YES** | Full product name |
| `shortName` | text | No | Display name for cards |
| `brandId` | integer | **YES** | FK to brands table |
| `categoryId` | integer | **YES** | FK to categories table |
| `subcategoryId` | integer | No | FK to subcategories table |
| `description` | text | **YES** | Plain text (no HTML) |
| `certifications` | text | No | WRAS, WaterMark, etc. |
| `materials` | jsonb | No | `{body, seat?, disc?, sleeve?}` |
| `pressureRange` | text | No | "PN16", "PN10-PN40" |
| `temperature` | text | No | "-20°C to +110°C" |
| `sizeFrom` | text | No | "DN50 to DN300" |
| `leadTime` | text | No | "In Stock", "2-3 weeks" |
| `video` | text | No | YouTube URL |
| `priceVaries` | boolean | No | true = has size variations |
| `priceNote` | text | No | "Prices ex GST" |
| `basePrice` | decimal | No | For non-varying products |
| `isActive` | boolean | No | Default true |
| `straubEquivalent` | text | No | Competitor cross-reference |

### Related Tables

#### product_variations (Size/Price Options)
```typescript
{
  productId: number,     // FK
  size: string,          // "48.3mm"
  label: string,         // "48.3mm Pipe Outside Diameter"
  price: decimal,        // 45.50 (null = POA)
  sku: string,           // Size-specific SKU
  source: string,        // 'neto' | 'manual'
  displayOrder: number   // Sort order
}
```

#### product_images
```typescript
{
  productId: number,
  url: string,           // Vercel Blob URL
  alt: string,           // SEO alt text
  type: string,          // 'image' | 'video'
  isPrimary: boolean,    // Main product image
  displayOrder: number
}
```

#### product_features (Bullet Points)
```typescript
{
  productId: number,
  feature: string,       // "316 stainless steel construction"
  displayOrder: number
}
```

#### product_specifications
```typescript
{
  productId: number,
  label: string,         // "Body Material"
  value: string,         // "316 Stainless Steel (CF8M)"
  displayOrder: number
}
```

#### product_applications
```typescript
{
  productId: number,
  application: string,   // "Water treatment"
  displayOrder: number
}
```

---

## How to Add/Edit Products

### Method 1: Admin UI (Recommended)

1. Go to `/admin/products`
2. Click "Add Product" or edit existing
3. Fill required fields
4. Upload images (auto-saves to Blob)
5. Save

### Method 2: API (Programmatic)

```bash
# Create product
POST /api/admin/products
Authorization: (requires NextAuth session)
Content-Type: application/json

{
  "name": "Orbit Flex-Grip Coupling 316SS",
  "shortName": "Flex-Grip 316SS",
  "slug": "orbit-flex-grip-316ss",
  "sku": "OFG-SS",
  "brandId": 1,
  "categoryId": 2,
  "description": "Flexible pipe coupling for...",
  "materials": { "body": "316 Stainless Steel" },
  "pressureRange": "PN16",
  "priceVaries": true,
  "features": ["Feature 1", "Feature 2"],
  "specifications": [
    { "label": "Material", "value": "316SS" }
  ],
  "variations": [
    { "size": "48.3mm", "label": "48.3mm OD", "price": "45.50" }
  ],
  "images": [
    { "url": "https://...blob.vercel-storage.com/...", "alt": "Product image" }
  ]
}
```

### Method 3: Scripts (Bulk Operations)

```bash
# Sync catalog.ts → DB
npx tsx scripts/sync-catalog-to-db.ts

# Seed fresh database
npx tsx scripts/seed.ts

# Check prices against source
npx tsx scripts/check-prices.ts
```

---

## Image Handling

### Upload Process

1. **Upload to Blob** via `/api/upload`:
   ```typescript
   const formData = new FormData();
   formData.append('file', file);
   formData.append('folder', 'products');

   const res = await fetch('/api/upload', {
     method: 'POST',
     body: formData,
   });
   const { url } = await res.json();
   // url = "https://...blob.vercel-storage.com/products/..."
   ```

2. **Save URL to DB** in product_images table

### Image Caching

- **Upload**: `cacheControlMaxAge: 31536000` (1 year)
- **Next.js**: `minimumCacheTTL: 604800` (1 week)
- Images served via Next.js Image Optimization

### Supported Formats

JPEG, PNG, WebP, GIF (max 10MB)

---

## Validation Rules

### Unique Constraints

- `products.slug` - Must be unique across all products
- `products.sku` - Must be unique across all products

### Naming Conventions

| Field | Format | Example |
|-------|--------|---------|
| slug | lowercase-hyphenated | `orbit-flex-grip-316ss` |
| sku | uppercase-hyphenated | `OFG-SS`, `BFLYW-316` |
| category slug | lowercase-hyphenated | `pipe-couplings` |

### Foreign Key Requirements

Before creating a product, ensure:
- Brand exists (check `/admin/brands`)
- Category exists (check `/admin/categories`)
- Subcategory exists if using (check `/admin/categories`)

---

## Common Operations

### Add New Product

1. Ensure brand/category exist
2. Upload images to Blob (via admin or API)
3. Create product with all fields
4. Add variations if priceVaries=true
5. Verify on frontend

### Update Prices

```typescript
// Via script or direct DB
await db
  .update(productVariations)
  .set({ price: '49.95' })
  .where(
    and(
      eq(productVariations.productId, productId),
      eq(productVariations.size, '48.3mm')
    )
  );
```

### Add Size Variation to Existing Product

```typescript
await db.insert(productVariations).values({
  productId: 123,
  size: '100mm',
  label: '100mm Pipe OD',
  price: '89.50',
  displayOrder: 10,
});
```

### Deactivate Product (Soft Delete)

```typescript
await db
  .update(products)
  .set({ isActive: false })
  .where(eq(products.id, productId));
```

---

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `scripts/seed.ts` | Initial database seeding |
| `scripts/sync-catalog-to-db.ts` | Sync catalog.ts → DB |
| `scripts/check-prices.ts` | Verify prices match source |
| `scripts/create-admin.ts` | Create admin user |
| `scripts/import-neto.ts` | Import from Neto export |

Run with: `npx tsx scripts/{script}.ts`

---

## Handoff Protocol (Replit → Claude)

Replit AI cannot directly:
- Run database migrations
- Execute Drizzle push/pull
- Upload to Vercel Blob
- Run `npx tsx` scripts

### For Replit AI Operations:

1. Create JSON file in `_handoff/pending/`
2. Commit and push
3. Claude Code will process

See `_handoff/README.md` for format details.

---

## Troubleshooting

### "Product not showing on frontend"

1. Check `isActive = true` in DB
2. Verify category/subcategory slugs match routes
3. Check for errors in Vercel logs

### "Image not loading"

1. Verify URL is valid Blob URL
2. Check `next.config.js` remotePatterns includes blob domain
3. Try hard refresh (Ctrl+Shift+R)

### "SKU/Slug already exists"

Unique constraint violation. Check existing products and use different value.

### "Database connection failed"

1. Verify DATABASE_URL in `.env.local`
2. Check Neon dashboard for connection limits
3. Ensure IP not blocked (Neon allows all by default)

---

## Image Selection Rules

**For hero sections and category pages:**
- **Always use the transparent background PNG** (the primary/first image shown on product pages)
- Never use JPG alt images for hero sections - they have backgrounds
- The transparent PNG is typically stored at paths like `/products/{brand}/{product-slug}-{hash}.png`
- Check the actual product page to find the correct transparent image URL
