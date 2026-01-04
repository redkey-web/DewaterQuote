# Image SEO & Cleanup

**Created**: 2025-12-28
**Type**: Enhancement
**Status**: Complete

## Summary

Clean up product page images by removing duplicates, replacing the warranty image with a prominent badge, and optimizing alt text for SEO with product name, category, and "Australia-wide delivery".

## Scope

- **Impact**: Medium
- **Files**: ~2
- **Components**: ProductDetailClient.tsx, possibly product cards

## Changes

### 1. Remove Duplicate & Warranty Images

Filter product images to:
- Remove exact URL duplicates (already done)
- Filter out warranty/promotional images (URL contains "warranty", "year")

```tsx
const uniqueImages = product.images
  .filter((img, idx, arr) => arr.findIndex((i) => i.url === img.url) === idx)
  .filter((img) => !img.url.toLowerCase().includes('warranty') && !img.alt.toLowerCase().includes('warranty'))
```

### 2. Add Warranty Badge

Replace warranty image with a prominent badge on the product info section. Position options:
- **Option A**: Badge near the product title (prominent)
- **Option B**: Overlay on main image corner
- **Option C**: In the "Product Details" section

Recommended: **Option A** - Badge near price/free delivery info

```tsx
<Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950">
  <Shield className="w-3 h-3 mr-1" />
  Up to 5 Year Warranty
</Badge>
```

### 3. SEO Alt Text for Main Image

Update main product image alt text to include:
- Product name
- Category name (human readable)
- "Australia-wide delivery"

```tsx
const mainImageAlt = `${product.name} - ${getCategoryName(product.category)} | Australia-wide delivery`
```

For thumbnails, keep original alt text.

## Implementation Steps

- [x] Phase 1: Filter warranty images from display
- [x] Phase 2: Add warranty badge overlay on main image
- [x] Phase 3: Update main image alt text for SEO
- [x] Phase 4: Verify and test

## Notes

- Warranty badge should be visually prominent but not overwhelming
- Alt text max ~125 chars for SEO best practice
- Consider adding warranty info to product JSON-LD schema
