# Ticker & Search Polish

**Created**: 2026-01-17
**Type**: Enhancement
**Status**: Complete

## Summary

Visual polish for the discount ticker (drop shadow on percentages, water wave effect) and functional fix for search results page (currently pressing Enter goes to /products but ignores the query).

## Scope

- **Impact**: Low-Medium
- **Files**: ~3-4 estimated
- **Components**: BulkPricingTicker, /products page

---

## Phase 1: Ticker Text Drop Shadow

### 1.1 Add Drop Shadow to Discount Percentages
**File**: `src/components/BulkPricingTicker.tsx`

Current code (line 18):
```jsx
<span className="font-bold text-[#ccff00]" style={{ textShadow: 'none' }}>5% OFF</span>
```

Change to 50% opacity drop shadow:
```jsx
<span className="font-bold text-[#ccff00]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>5% OFF</span>
```

**Tasks**:
- [x] Update "5% OFF" text shadow (line 18)
- [~] Update "10% OFF" text shadow - NOT NEEDED per user (orange/red visible)
- [~] Update "15% OFF" text shadow - NOT NEEDED per user
- [x] Also update stormy ticker 5% variant (line 43)
- [x] Verify visibility on ticker background

---

## Phase 2: Search Results Page

### 2.1 The Problem
- Header search form submits to `/products?search={query}` (Header.tsx:159)
- But `/products/page.tsx` ignores the `search` parameter completely
- Users see all products, not filtered results

### 2.2 Solution: Add Search Filtering
**File**: `src/app/products/page.tsx`

Update to accept and use searchParams:
```tsx
export default async function ProductRangePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams
  const allProducts = await getAllProducts()

  // Filter if search query present
  const filteredProducts = search
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
      )
    : allProducts
```

**Tasks**:
- [x] Add searchParams to page props
- [x] Implement product filtering by name/description/sku
- [x] Show search results header with query and count
- [x] Show "No results found" state with suggestions
- [x] Maintain category grouping for non-search view

### 2.3 Search Results UI
When searching:
- Show "Search results for '{query}'" heading
- Show result count
- Display products in grid (not grouped by category)
- Add "Clear search" link to return to full listing

---

## Phase 3: Ticker Water Wave Effect

### 3.1 Current State
5 wave layers with 3 using `backdropFilter: blur()`:
- Layer 1: blur(8px) - large slow wave
- Layer 2: blur(4px) - medium ripples
- Layer 5: blur(3px) - vertical breathing

### 3.2 Changes
Remove blur from 2 layers, replace with water/foam gradients:

**Option A: Foam Bubbles Effect**
```css
background:
  radial-gradient(circle at 10% 50%, rgba(255,255,255,0.15) 2px, transparent 2px),
  radial-gradient(circle at 30% 30%, rgba(0,200,200,0.1) 3px, transparent 3px),
  radial-gradient(circle at 50% 70%, rgba(255,255,255,0.12) 2px, transparent 2px),
  radial-gradient(circle at 70% 40%, rgba(0,220,220,0.08) 4px, transparent 4px),
  radial-gradient(circle at 90% 60%, rgba(255,255,255,0.1) 2px, transparent 2px);
```

**Option B: Beach Wave Wash**
```css
background:
  linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%),
  linear-gradient(70deg, transparent 40%, rgba(0,210,210,0.08) 55%, transparent 65%);
```

**Tasks**:
- [x] Remove backdrop-blur from layer 1 and layer 5
- [x] Add foam bubbles gradient to layer 1
- [x] Add beach wave wash gradient to layer 5
- [x] Kept existing animation timing (works well)
- [ ] Test on desktop and mobile

---

## Phase 4: Verification

- [x] Verify basket strainer subcategory exists at `/basket-strainers` - **CONFIRMED**
- [x] Verify header menu link to basket strainers - **CORRECT** (line 210)
- [ ] Test ticker shadow visibility
- [ ] Test search with various queries ("basket", "strainer", "coupling")
- [ ] Test search on mobile
- [ ] Verify water effect looks natural

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/BulkPricingTicker.tsx` | Text shadow + water wave gradients |
| `src/app/products/page.tsx` | Add search filtering with searchParams |

---

## Dependencies

- None (all frontend CSS/TSX changes)

## Notes

- Basket strainer subcategory page already exists at `/basket-strainers`
- Consider adding fuzzy search in future (Fuse.js)
- Water effect should be subtle, not distracting from text

---

Last Updated: 2026-01-17
