# Product Linkage Audit

**Created**: 2026-01-04
**Type**: audit
**Status**: Active

## Summary

Audit to identify:
1. Active products (SKUs) in the database that don't have accessible pages
2. Product pages that aren't linked from any category or subcategory page

## Scope

- **Impact**: Low (audit only, no code changes)
- **Files**: Script-based investigation
- **Components**: Database queries, route analysis

## How Products Get Pages

Products get pages via the dynamic route `src/app/[slug]/page.tsx`:
- Uses `generateStaticParams()` which calls `getAllProductSlugs()` from `src/data/products.ts`
- Returns all products where `isActive = true`
- Each product slug becomes a URL: `/{product-slug}`

**Conclusion**: All active products automatically have pages.

## How Products Get Linked

Products appear on listing pages via:

1. **Category pages** (e.g., `/pipe-couplings`) - `getProductsByCategory(categorySlug)`
2. **Subcategory pages** (e.g., `/butterfly-valves`) - `getProductsBySubcategory(categorySlug, subcategorySlug)`
3. **Brand pages** (e.g., `/brands/straub`) - `getProductsByBrand(brandSlug)`
4. **Products page** (`/products`) - `getAllProducts()`
5. **Search** - all active products searchable

## Potential Gaps

A product could be "orphaned" (has page but not linked) if:
- `categoryId` points to a category with no listing page
- `subcategoryId` is null AND no category listing page shows it
- `brandId` points to a brand with no brand page

## Phases

### Phase 1: Database Audit Script
- [ ] Query all active products with their category/subcategory/brand
- [ ] Cross-reference against known listing pages
- [ ] Identify orphaned products

### Phase 2: Report Findings
- [ ] List any products without category linkage
- [ ] List any products without subcategory linkage
- [ ] List any products without brand page linkage
- [ ] Identify products only reachable via /products or search

## Notes

- The site uses flat URL architecture
- Products at `/{slug}` are reachable if you know the URL
- Question is whether they're discoverable via navigation
