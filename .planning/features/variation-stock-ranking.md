# Variation Stock & Ranking System

**Created**: 2026-01-14
**Completed**: 2026-01-14
**Type**: Feature Enhancement
**Priority**: Medium
**Status**: ✅ Complete

## Summary

Enhance the product admin panel to support:
1. **Explicit size ranking (1-5000)** - Allow setting sort order for each size variation so new sizes can be inserted at the correct position
2. **Per-variation stock quantity** - Display and edit stock levels directly in the product form alongside price/size

## Problem Statement

### Size Ranking Issue
- Neto had no logic for sorting sizes - new sizes were added without proper ordering
- Current `displayOrder` field exists but is not exposed in the admin UI
- New sizes default to order 0, causing them to appear at the top
- Need a clear ranking system (1-5000) so admin can position new sizes correctly

### Stock Visibility Issue
- `product_stock` table supports per-variation stock via `variationId`
- Stock is managed on separate `/admin/inventory` page - not convenient when editing products
- Admin needs to see stock levels while editing prices/sizes on product pages

## Scope

- **Impact**: Medium
- **Files**: ~4-6 estimated
- **Areas**: ProductForm, product API routes, database queries

---

## Phase 1: Database & Schema Verification

### 1.1 Verify Existing Schema

**Current `productVariations` table:**
```typescript
productVariations = pgTable('product_variations', {
  id: serial('id').primaryKey(),
  productId: integer('product_id'),
  size: text('size').notNull(),
  label: text('label').notNull(),
  price: decimal('price'),
  sku: text('sku'),
  source: text('source').default('neto'),
  displayOrder: integer('display_order').default(0),  // ← Already exists!
  isSuspended: boolean('is_suspended').default(false),
});
```

**Current `productStock` table:**
```typescript
productStock = pgTable('product_stock', {
  id: serial('id').primaryKey(),
  productId: integer('product_id'),
  variationId: integer('variation_id'),  // ← Per-variation stock supported!
  qtyInStock: integer('qty_in_stock').default(0),
  incomingQty: integer('incoming_qty').default(0),
  preorderQty: integer('preorder_qty').default(0),
  reorderPoint: integer('reorder_point').default(5),
  expectedArrival: timestamp('expected_arrival'),
  lastUpdatedAt: timestamp('last_updated_at'),
});
```

**Tasks:**
- [x] Confirm `displayOrder` is being saved correctly on variation create/update
  - ✅ Saves using array index (0,1,2...) - works but needs gap numbering for insertions
- [x] Confirm `product_stock.variationId` foreign key works correctly
  - ✅ 31 stock records have variationId set
- [x] Check if any stock records already have `variationId` set
  - ✅ Yes, 31 records exist with variation-level stock

---

## Phase 2: UI Enhancement - Size Ranking

### 2.1 Add Sort Rank Field to Variations

**File**: `src/components/admin/ProductForm.tsx`

**Current UI (simplified):**
```
| Size      | Label     | Price  | SKU    | [Delete] |
|-----------|-----------|--------|--------|----------|
| 48.3mm    | 48.3mm OD | $45.50 | OFG-48 | 🗑️        |
| 60.3mm    | 60.3mm OD | $52.00 | OFG-60 | 🗑️        |
```

**Proposed UI:**
```
| Rank | Size      | Label     | Price  | SKU    | [Delete] |
|------|-----------|-----------|--------|--------|----------|
| 100  | 48.3mm    | 48.3mm OD | $45.50 | OFG-48 | 🗑️        |
| 200  | 60.3mm    | 60.3mm OD | $52.00 | OFG-60 | 🗑️        |
```

**Ranking Guidelines (show as help text):**
- Range: 1-5000
- Use gaps: 100, 200, 300... to allow insertions
- Lower numbers appear first in dropdowns
- Example: To insert between 100 and 200, use 150

**Tasks:**
- [x] Update variations state to include `displayOrder`
- [x] Add "Rank" input column (number, min=1, max=5000)
- [x] Sort variations by rank in form display
- [x] Add help text explaining ranking system
- [x] Auto-suggest next rank when adding new size (max + 100)

### 2.2 Update Variation Save Logic

**File**: `src/app/api/admin/products/route.ts` (or `[id]/route.ts`)

**Tasks:**
- [x] Pass `displayOrder` from form to API
- [x] Save `displayOrder` on variation insert/update
- [x] Return variations sorted by `displayOrder` on product fetch

---

## Phase 3: UI Enhancement - Per-Variation Stock

### 3.1 Show Stock Quantity in Variations Table

**File**: `src/components/admin/ProductForm.tsx`

**Extended UI:**
```
| Rank | Size      | Label     | Price  | Stock | SKU    | [Delete] |
|------|-----------|-----------|--------|-------|--------|----------|
| 100  | 48.3mm    | 48.3mm OD | $45.50 | 24    | OFG-48 | 🗑️        |
| 200  | 60.3mm    | 60.3mm OD | $52.00 | 0     | OFG-60 | 🗑️        |
```

**Stock field behavior:**
- Read-only display OR editable inline
- Show "-" if no stock record exists
- Color code: Green (>5), Yellow (1-5), Red (0)

**Tasks:**
- [x] Fetch stock data joined with variations on product load
- [x] Add "Stock" column to variations table
- [x] Show stock badge with color coding
- [x] Decision: Read-only or editable? (editable is more useful) → **EDITABLE INLINE**

### 3.2 Add Stock Editing (Optional but Recommended)

If making stock editable in product form:

**Tasks:**
- [x] Add stock input field per variation
- [x] Create/update stock records when saving product
- [x] Handle case where stock record doesn't exist (create new)
- [x] Update lastUpdatedAt timestamp on stock save

### 3.3 Update Product API for Stock

**File**: `src/app/api/admin/products/route.ts`

**Tasks:**
- [x] Include stock data in product GET response
- [x] Accept stock updates in product PUT/PATCH
- [x] Create stock records for variations that don't have them
- [x] Update existing stock records

---

## Phase 4: Data Migration (Optional)

### 4.1 Set Default Ranks for Existing Variations

If existing variations all have `displayOrder = 0`:

**Script**: `scripts/set-variation-ranks.ts`

**Logic:**
1. Group variations by productId
2. For each product, sort variations by size (extract numeric value)
3. Assign ranks: 100, 200, 300, ...

**Tasks:**
- [x] Write script to auto-rank existing variations (`scripts/set-variation-ranks.ts`)
- [x] Run on database - ✅ 1,271 variations updated
- [x] Verify results - ✅ Gap numbering (100, 200, 300...) applied, sorted by numeric size

### 4.2 Link Existing Stock to Variations

If product-level stock exists but variation-level doesn't:

**Script**: `scripts/link-stock-to-variations.ts`

**Logic:**
1. For each product with stock but no variation-specific stock
2. Either keep as product-level (no change needed)
3. Or split into variation-level if quantities are known

**Tasks:**
- [x] Analyze current stock data structure - ✅ 31 variation-level stock records exist
- [x] Decide on migration strategy - ✅ Not needed, stock system already supports variation-level
- [x] Write migration script if needed - ✅ Not needed

---

## Phase 5: Frontend Display Verification

### 5.1 Verify Size Dropdown Sorting

**Files to check:**
- Product detail page size dropdown
- Quote/cart size selection
- Any other size selectors

**Tasks:**
- [x] Confirm frontend uses `displayOrder` for sorting - ✅ All product queries use `orderBy: asc(displayOrder)`
- [x] Test that new rank values sort correctly - ✅ Verified in DB
- [x] Verify no hardcoded sorting logic exists - ✅ All sorting via displayOrder

---

## Implementation Notes

### Ranking System Design

**Why 1-5000 instead of simple ordering?**
- Gap numbering allows insertions without renumbering
- Neto-imported sizes can keep their implicit order
- New manual sizes can be precisely positioned

**Example workflow:**
1. Existing sizes have ranks: 100, 200, 300
2. Admin adds new size between first and second
3. Admin sets rank to 150
4. Sizes now sort: 100, 150, 200, 300

### Stock Integration Approach

**Option A: Read-only display**
- Show stock from inventory system
- Link to inventory page for editing
- Less code, but less convenient

**Option B: Inline editing (Recommended)**
- Edit stock directly in product form
- Sync with product_stock table
- More convenient for admin workflow

### Backward Compatibility

- Existing variations with `displayOrder = 0` will appear first
- Migration script can set sensible defaults
- No breaking changes to frontend

---

## Files Summary

| Area | Files |
|------|-------|
| **Form UI** | ProductForm.tsx |
| **API** | api/admin/products/route.ts, api/admin/products/[id]/route.ts |
| **Database** | schema.ts (verify), db queries |
| **Scripts** | set-variation-ranks.ts, link-stock-to-variations.ts |
| **Tests** | Verify size dropdown sorting |

---

## Success Criteria

1. Admin can set explicit rank (1-5000) for each size variation
2. Sizes display sorted by rank in frontend dropdowns
3. New sizes can be positioned between existing sizes
4. Stock quantity visible in product form alongside price
5. Stock can be edited inline (if Option B chosen)
6. Existing data migrated with sensible defaults

---

Last Updated: 2026-01-14
