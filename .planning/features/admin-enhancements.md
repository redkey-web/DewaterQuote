# Admin Panel Enhancements

**Created**: 2026-01-10
**Type**: Enhancement
**Status**: Active
**Combined from**:
  - admin-seo-optimization.md
  - admin-product-ordering.md

## Summary

Admin panel improvements including SEO blocking verification, loading states, performance optimization, and product display ordering functionality.

## Scope

- **Impact**: Medium
- **Files**: ~12-15 estimated
- **Components**: Admin pages, loading skeletons, ProductsTable, data queries

---

## Phase 1: SEO Blocking (Completed) ✅

### Already Complete
- [x] Admin layout has `robots: 'noindex, nofollow'` metadata
- [x] Applies to all `/admin/*` routes via Next.js metadata inheritance

### 1.1 Additional SEO Blocking
- [ ] Verify robots.txt excludes /admin
- [ ] Add X-Robots-Tag header for API routes via next.config.js:

```js
{
  source: '/admin/:path*',
  headers: [
    { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
  ],
},
{
  source: '/api/admin/:path*',
  headers: [
    { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
  ],
},
```

---

## Phase 2: Loading States

Per Context7 patterns, add loading.tsx files for instant visual feedback:

### 2.1 Create Admin Loading Skeletons
- [ ] Create `/admin/loading.tsx` skeleton
- [ ] Create `/admin/inventory/loading.tsx` skeleton
- [ ] Create `/admin/pricing/loading.tsx` skeleton
- [ ] Create `/admin/logistics/loading.tsx` skeleton
- [ ] Create `/admin/products/loading.tsx` skeleton

### Loading Skeleton Pattern (from Context7)
```tsx
// src/app/admin/loading.tsx
export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded-lg" />
    </div>
  );
}
```

---

## Phase 3: Performance Audit

### 3.1 Component Analysis
- [ ] Check for unnecessary client components
- [ ] Verify data fetching is parallel where possible
- [ ] Add Suspense boundaries for independent data
- [ ] Check bundle size of admin pages

### 3.2 Additional Security
- [ ] Add noindex header to admin API routes
- [ ] Verify middleware blocks unauthenticated access
- [ ] Consider rate limiting on admin APIs

---

## Phase 4: Product Display Ordering

### 4.1 Update Frontend Queries
Update all product queries to sort by `displayOrder` first, then `name` as fallback:

```typescript
orderBy: [asc(products.displayOrder), asc(products.name)]
```

- [ ] Update `src/data/products.ts` - 4 queries (lines 231, 277, 306, 324)
- [ ] Update `src/lib/db/products.ts` - 3 queries (lines 77, 110, 142)
- [ ] Verify products still display (with default displayOrder=0, fallback to name)

### 4.2 Create Reordering API
- [ ] Create `POST /api/admin/products/reorder` endpoint
- [ ] Accept array of `{ productId, displayOrder }` pairs
- [ ] Batch update displayOrder values
- [ ] Add category-scoped reordering option

```typescript
// POST /api/admin/products/reorder
{
  products: [
    { id: 1, displayOrder: 0 },
    { id: 2, displayOrder: 1 },
    { id: 3, displayOrder: 2 },
  ]
}
```

### 4.3 Add Reordering UI
Using up/down arrows (simpler than drag-drop):

- [ ] Add "Order" column to ProductsTable with up/down buttons
- [ ] Add category filter for ordering within category context
- [ ] Call reorder API on button click
- [ ] Show current displayOrder value
- [ ] Add "Reset to Alphabetical" button

### 4.4 Category-Specific Ordering Page (Optional)
- [ ] Add "Manage Product Order" link to category admin
- [ ] Create `/admin/categories/[id]/products` page
- [ ] Show only products in that category
- [ ] Up/down ordering controls

---

## Implementation Notes

### Database
- `displayOrder` column already exists on `products` table
- Default value is 0, so all products start equal
- Lower numbers display first

### Ordering Decision
**Global ordering** recommended (simpler):
- One displayOrder per product
- Products maintain same order across all views

Alternative (more complex): Per-category ordering using `productCategories.displayOrder`

---

## Files Summary

| File | Changes |
|------|---------|
| `src/app/admin/loading.tsx` | New skeleton |
| `src/app/admin/*/loading.tsx` | New skeletons (5 files) |
| `src/data/products.ts` | Add displayOrder to orderBy |
| `src/lib/db/products.ts` | Add displayOrder to orderBy |
| `src/app/api/admin/products/reorder/route.ts` | New endpoint |
| `src/components/admin/ProductsTable.tsx` | Add order controls |
| `next.config.js` | X-Robots-Tag headers |

---

## Source References
- Original: `.planning/combined-sources/admin-seo-optimization.md`
- Original: `.planning/combined-sources/admin-product-ordering.md`

---

Last Updated: 2026-01-10
