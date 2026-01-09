# Admin Product Ordering

**Created**: 2026-01-09
**Type**: Enhancement
**Status**: Planning

## Summary

Add ability in admin panel to control the display order of products on category and brand pages. Products currently sort alphabetically by name on the frontend - this feature allows manual ordering via drag-and-drop or up/down controls.

## Current State

| Aspect | Current | Target |
|--------|---------|--------|
| DB Schema | `displayOrder` column exists | ✅ No change needed |
| Frontend display | `orderBy: products.name` | `orderBy: products.displayOrder, products.name` |
| Admin products list | Sorted by `updatedAt` | Add reordering UI |
| Admin category pages | No product ordering | Add product order management |

## Scope

- **Impact**: Medium
- **Files**: ~8-10 estimated
- **Components**: ProductsTable, category admin pages, product queries

---

## Phase 1: Update Frontend Queries to Use displayOrder

Update all product queries to sort by `displayOrder` first, then `name` as fallback.

- [ ] Update `src/data/products.ts` - 4 queries
- [ ] Update `src/lib/db/products.ts` - 3 queries
- [ ] Verify products still display (with default displayOrder=0, fallback to name)

**Files:**
- `src/data/products.ts` (lines 231, 277, 306, 324)
- `src/lib/db/products.ts` (lines 77, 110, 142)

---

## Phase 2: Add Reordering API Endpoint

Create API endpoint to update product displayOrder values.

- [ ] Create `POST /api/admin/products/reorder` endpoint
- [ ] Accept array of `{ productId, displayOrder }` pairs
- [ ] Batch update displayOrder values
- [ ] Add category-scoped reordering (order within a category)

**Files:**
- `src/app/api/admin/products/reorder/route.ts` (new)

---

## Phase 3: Add Reordering UI to Admin

Option A: **Drag-and-drop** (better UX, more complex)
Option B: **Up/down arrows** (simpler, faster to implement)

Recommend: Start with up/down arrows, upgrade to drag-drop later if needed.

- [ ] Add "Order" column to ProductsTable with up/down buttons
- [ ] Add category filter for ordering within category context
- [ ] Call reorder API on button click
- [ ] Show current displayOrder value
- [ ] Add "Reset to Alphabetical" button

**Files:**
- `src/components/admin/ProductsTable.tsx`
- OR create new `src/components/admin/ProductOrderManager.tsx`

---

## Phase 4: Category-Specific Ordering Page (Optional)

For more intuitive ordering, add dedicated page per category.

- [ ] Add "Manage Product Order" link to category admin
- [ ] Create `/admin/categories/[id]/products` page
- [ ] Show only products in that category
- [ ] Drag-and-drop or up/down ordering
- [ ] Save order specific to that category

**Files:**
- `src/app/admin/categories/[id]/products/page.tsx` (new)

---

## Implementation Notes

### Database
- `displayOrder` column already exists on `products` table
- Default value is 0, so all products start equal
- Lower numbers display first

### Ordering Logic
```typescript
// Sort by displayOrder first, then name as tiebreaker
orderBy: [asc(products.displayOrder), asc(products.name)]
```

### API Shape
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

### Category Context
Products can appear in multiple categories via `productCategories` join table.
For category-specific ordering, may need to use `productCategories.displayOrder` instead of `products.displayOrder`.

---

## Dependencies

- Existing `displayOrder` column in products table ✅
- Admin authentication ✅
- ProductsTable component ✅

---

## Questions to Resolve

1. **Global vs Category ordering?**
   - Global: One displayOrder per product (simpler)
   - Per-category: Different order in each category (uses productCategories.displayOrder)

2. **Drag-drop library?**
   - `@dnd-kit/core` (modern, accessible)
   - `react-beautiful-dnd` (popular but unmaintained)
   - Simple up/down buttons (no library needed)

---

Last Updated: 2026-01-09
