# Plan: Fix Header Hover, Cart Scroll, and Size Labels

## Issues to Fix

### 1. Header Menu Text Hover Not Working
**Problem**: Mouseover isn't highlighting text on header menu items (Products, Industry, etc.)

**Root Cause Investigation**: The buttons have correct hover classes (`hover:text-primary`), but there may be:
- Z-index conflicts with the dropdown portal
- Transition not working properly
- Pointer-events being blocked

**Solution**: Verify hover styles are applied correctly. May need to adjust z-index or ensure no overlay is blocking.

### 2. Cart Scroll Wheel Affecting Page
**Problem**: When cart slides out, scroll wheel affects page instead of cart when mouse is over cart.

**Root Cause**: The wheel events bubble up from the cart to the page body. The `overflow-y-auto` on the cart content area isn't isolating scroll context.

**Solution**: Add `overscroll-behavior: contain` CSS to the cart panel to isolate scroll context.

### 3. Missing Size Labels on Quote Items
**Problem**: Only some products (like Flanged Coupling) show size labels; others (like Elbow Repair Clamp) don't.

**Root Cause** (from previous investigation):
- Some products have no `sizeOptions` defined in catalog
- Some database variations have empty `label` fields
- The filtering logic in `getQuoteItemSizeLabel` may be too strict

**Solution**: Multi-part fix:
1. Relax the size label filter - show the label if it exists, even if it doesn't match strict "looks like size" pattern
2. Fall back to showing the variation's `size` field if `sizeLabel` is empty
3. Consider database audit to populate missing labels

---

## Implementation Steps

### Step 1: Fix Cart Scroll Isolation
**File**: `src/components/QuoteCart.tsx`
- Add `overscroll-behavior-y: contain` to the cart panel
- This prevents scroll events from propagating to the page

### Step 2: Fix Header Menu Hover
**File**: `src/components/Header.tsx`
- Verify the hover classes are correct (they appear to be)
- Check if there's a z-index or pointer-events issue
- Add explicit `cursor-pointer` if needed
- Test that `transition-all` includes `color`

### Step 3: Relax Size Label Filter
**File**: `src/lib/quote.ts`
- Modify `getQuoteItemSizeLabel` to be less strict
- Show any non-empty label/size that isn't just the product name
- Remove the "must look like a size" requirement (too restrictive)

---

## Files to Modify
1. `src/components/QuoteCart.tsx` - Cart scroll isolation
2. `src/components/Header.tsx` - Hover text highlight fix
3. `src/lib/quote.ts` - Relax size label filtering

## Verification
1. **Hover**: Navigate to site, hover over Products/Industry/Brands - text should change to primary color
2. **Cart scroll**: Add items, open cart, hover over cart content, use scroll wheel - should only scroll cart
3. **Size labels**: Add various Orbit products to cart - all should show size labels if they have variation data
