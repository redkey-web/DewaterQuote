# Volume Discount UX Enhancement

**Created**: 2026-01-16
**Type**: Enhancement
**Status**: Complete

## Summary

Enhance product pages to clearly explain that volume discounts apply to TOTAL cart quantity (not per-product), and show users their current applicable discount tier based on existing cart contents before they add new items.

## Problem Statement

Currently:
1. Bulk pricing tiers are shown (2-4 = 5%, 5-9 = 10%, 10+ = 15%) but no explanation that it's TOTAL volume
2. Users don't see what discount they'd get until after adding items
3. If a user already has 8 items in cart, they don't know adding 2 more unlocks 15% tier

## Scope

- **Impact**: Medium
- **Files**: ~4 estimated
- **Components**: ProductDetailClient, QuoteContext, potentially BulkPricingTicker

---

## Phase 1: Add Explanatory Text

### 1.1 Update Bulk Pricing Section
**File**: `src/components/ProductDetailClient.tsx` (lines 545-567)

Add clear text under the bulk pricing tiers:
- "Discounts apply to your total order quantity across all products"
- Make this text prominent but not obtrusive

**Tasks**:
- [x] Add explanatory paragraph under the bulk pricing tiers
- [x] Style appropriately (smaller text, muted color)
- [x] Ensure text doesn't clutter the UI

---

## Phase 2: Show Current Cart Discount Context

### 2.1 Expose Total Cart Quantity
**File**: `src/context/QuoteContext.tsx`

The context already has `getTotalQuantity()` internally but doesn't expose it.

**Tasks**:
- [x] Add `totalQuantity: number` to QuoteContextValue interface
- [x] Expose the calculated total in the context value
- [x] Update the value object to include totalQuantity

### 2.2 Show Cart-Aware Discount on Product Pages
**File**: `src/components/ProductDetailClient.tsx`

Display the user's current tier based on cart contents:
- "Your current order: X items (Y% discount)"
- Show what tier they'd reach with current selection: "Adding Z would give you XX% off"

**Tasks**:
- [x] Import `useQuote` to get current cart total
- [x] Calculate current discount tier from cart quantity
- [x] Show current tier if user has items in cart
- [x] Show projected tier (cart + selected quantity) dynamically
- [x] Highlight when adding items would unlock a new tier

---

## Phase 3: Dynamic Discount Preview

### 3.1 Real-time Tier Preview
When user selects quantity on product page, show:
- Current price (without discount)
- Price with applicable discount (based on cart total + selection)
- Savings amount if discount applies

**Tasks**:
- [x] Calculate effective discount using cart total + selected quantity
- [x] Update the price display to show discounted price when applicable
- [x] Show "You save $X.XX" message when discount applies
- [x] Highlight tier upgrade moments (e.g., "Add 1 more for 10% off!")

### 3.2 Tier Progress Indicator (Optional Enhancement)
Show visual progress toward next tier:
- "2 more items for 10% discount"
- Small progress bar or indicator

**Tasks**:
- [x] Create helper function to calculate items needed for next tier
- [x] Display progress message when close to next tier
- [x] Make this non-intrusive but visible

---

## Phase 4: Testing & Polish

### 4.1 Test Scenarios
- [x] Empty cart: Shows standard tiers with explanation
- [x] Cart with 1 item: Shows "1 item in cart, no discount yet"
- [x] Cart with 3 items: Shows "3 items (5% discount), add 2 for 10%"
- [x] Cart with 8 items: Shows "8 items (10% discount), add 2 for 15%"
- [x] Cart with 10+ items: Shows "10+ items (15% discount - maximum)"

### 4.2 Visual Consistency
- [x] Ensure discount info matches cart display
- [x] Test on mobile and desktop
- [x] Verify colors/styling match brand

---

## Technical Notes

### Existing Infrastructure
- `getDiscountTier(quantity)` in `lib/quote.ts` - returns tier for given quantity
- `getDiscountPercentage(quantity)` - returns percentage (0, 5, 10, or 15)
- `calculateDiscountedPrice(unitPrice, quantity)` - calculates discounted price
- `QuoteContext` has `items` array and internal `getTotalQuantity()`

### Key Code Locations
- Bulk pricing display: `ProductDetailClient.tsx:545-567`
- Discount calculation: `lib/quote.ts:168-212`
- Cart state: `context/QuoteContext.tsx:75-78`

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ProductDetailClient.tsx` | Add explanatory text, show cart-aware discount |
| `src/context/QuoteContext.tsx` | Expose `totalQuantity` in context |
| `src/lib/quote.ts` | (Optional) Add helper for "items to next tier" |

---

## Dependencies

- None (all infrastructure exists)

## Notes

- This is purely frontend UX - no backend/database changes needed
- AU-only feature (already gated by `isAustralia` check)
- Should not affect non-AU users who don't see pricing
