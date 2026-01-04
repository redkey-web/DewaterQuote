# Category Page Standardization

**Created**: 2026-01-02
**Type**: Enhancement
**Status**: Completed

## Summary

Audit and standardize all category pages to follow a consistent layout pattern that improves user experience and SEO. The new layout prioritizes critical information before product listings, adds visual subcategory navigation with product images, and moves supplementary content below the product grid.

## Target Layout (Standard)

```
1. USPBar
2. Title + Short Description
3. Critical Info (key features, specs, materials)
4. "Search by Type" - Subcategory tiles WITH product images
5. All Products Grid
6. Additional Info (Applications, FAQs, etc.)
7. CTA Section
```

---

## Category Pages Identified

| # | Page | URL | Subcategories |
|---|------|-----|---------------|
| 1 | Valves | `/valves` | 6 (butterfly, check, gate, foot, float, ball) |
| 2 | Strainers | `/strainers` | 3 (y-strainer, simplex, duplex) |
| 3 | Rubber Expansion Joints | `/rubber-expansion-joints` | 10 (single-sphere, twin, arch types, etc.) |
| 4 | Pipe Couplings | `/pipe-couplings` | 3 (orbit, straub, straub-shaped) |
| 5 | Pipe Repair | `/pipe-repair` | 2 (orbit-repair, straub-repair) |
| 6 | Flange Adaptors | `/flange-adaptors` | 1 (flange-adaptor) |

---

## Current State vs Target State

### 1. Valves (`/valves/page.tsx`)

**Current Order:**
1. USPBar ✓
2. Title + Description ✓
3. "Browse by Valve Type" (text-only links)
4. All Products
5. "Valve Types" (info cards)
6. "Common Applications"
7. CTA ✓

**Issues:**
- [ ] Subcategory links have no images
- [ ] "Valve Types" info appears AFTER products
- [ ] Subcategory section title should be "Search by Type"

**Required Changes:**
- [ ] Rename "Browse by Valve Type" → "Search by Type"
- [ ] Add image tiles for subcategories (use first product image from each)
- [ ] Move "Valve Types" section BEFORE "All Valve Products"

---

### 2. Strainers (`/strainers/page.tsx`)

**Current Order:**
1. USPBar ✓
2. Title + Description ✓
3. "Browse by Type" (text-only links)
4. All Products
5. "Strainer Types" (info cards)
6. Applications & Selection Factors
7. CTA ✓

**Issues:**
- [ ] Subcategory links have no images
- [ ] "Strainer Types" info appears AFTER products

**Required Changes:**
- [ ] Rename "Browse by Type" → "Search by Type"
- [ ] Add image tiles for subcategories
- [ ] Move "Strainer Types" section BEFORE "All Strainer Products"

---

### 3. Rubber Expansion Joints (`/rubber-expansion-joints/page.tsx`)

**Current Order:**
1. USPBar ✓
2. Title + Description ✓
3. "Browse by Type" (text-only links)
4. All Products
5. Key Features & Applications
6. CTA ✓

**Issues:**
- [ ] Subcategory links have no images
- [ ] Key Features appear AFTER products
- [ ] Has 10 subcategories - may need to group/consolidate display

**Required Changes:**
- [ ] Rename "Browse by Type" → "Search by Type"
- [ ] Add image tiles for subcategories (may need 2 rows)
- [ ] Move "Key Features" section BEFORE "All Expansion Joint Products"

---

### 4. Pipe Couplings (`/pipe-couplings/page.tsx`)

**Current Order:**
1. USPBar ✓
2. Title + Description ✓
3. "Shop by Brand" (brand logo cards - NOT subcategories!)
4. All Products
5. "Coupling Types" (info cards)
6. Applications
7. Related Products
8. CTA ✓

**Issues:**
- [ ] Shows BRANDS instead of subcategory types
- [ ] No "Search by Type" subcategory section at all
- [ ] "Coupling Types" info appears AFTER products

**Required Changes:**
- [ ] Add "Search by Type" section with subcategory tiles (orbit-couplings, straub-couplings, straub-shaped-parts)
- [ ] Keep "Shop by Brand" but move it after products or remove
- [ ] Move "Coupling Types" section BEFORE products

---

### 5. Pipe Repair (`/pipe-repair/page.tsx`) ⚠️ MAJOR CHANGES

**Current Order:**
1. Hero Section (gradient background with emergency badge)
2. All Repair Products
3. "Why Use Pipe Repair Clamps?" (benefits)
4. "Common Repair Scenarios"
5. "Shop by Brand"
6. FAQs
7. Related Products
8. Emergency CTA

**Issues:**
- [ ] Completely different layout (landing page style)
- [ ] NO USPBar
- [ ] NO subcategory links
- [ ] Products appear BEFORE all info
- [ ] Hero section is non-standard

**Required Changes:**
- [ ] Add USPBar
- [ ] Replace hero with standard Title + Description
- [ ] Add "Search by Type" subcategory tiles (orbit-pipe-repair-clamps, straub-pipe-repair-clamps)
- [ ] Move "Why Use" and "Common Repair Scenarios" BEFORE products
- [ ] Move FAQs after products
- [ ] Standardize CTA

---

### 6. Flange Adaptors (`/flange-adaptors/page.tsx`)

**Current Order:**
1. ❌ NO USPBar
2. Title + Description ✓
3. "Browse by Type" (text-only, if subcategories exist)
4. All Products
5. Related Products
6. CTA ✓

**Issues:**
- [ ] Missing USPBar
- [ ] No critical info section (features, materials, applications)
- [ ] Subcategory links have no images
- [ ] Very minimal content compared to other pages

**Required Changes:**
- [ ] Add USPBar
- [ ] Add critical info section (key features, materials, applications)
- [ ] Rename "Browse by Type" → "Search by Type"
- [ ] Add image tiles for subcategories
- [ ] Add Applications section after products

---

## Implementation Phases

### Phase 1: Create Shared Component
- [ ] Create `SubcategoryTiles` component that fetches first product image for each subcategory
- [ ] Component accepts: categorySlug, subcategories array
- [ ] Displays grid of image tiles linking to subcategory pages

### Phase 2: Update Valves Page
- [ ] Add SubcategoryTiles component
- [ ] Move "Valve Types" before products
- [ ] Rename section heading

### Phase 3: Update Strainers Page
- [ ] Add SubcategoryTiles component
- [ ] Move "Strainer Types" before products
- [ ] Rename section heading

### Phase 4: Update Rubber Expansion Joints Page
- [ ] Add SubcategoryTiles component (handle 10 subcategories gracefully)
- [ ] Move "Key Features" before products
- [ ] Rename section heading

### Phase 5: Update Pipe Couplings Page
- [ ] Add SubcategoryTiles component for subcategories
- [ ] Move "Coupling Types" before products
- [ ] Decide what to do with brand section (move after products or remove)

### Phase 6: Update Pipe Repair Page (Major)
- [ ] Add USPBar
- [ ] Replace hero with standard layout
- [ ] Add SubcategoryTiles component
- [ ] Reorganize content order to match standard

### Phase 7: Update Flange Adaptors Page
- [ ] Add USPBar
- [ ] Add critical info section
- [ ] Add SubcategoryTiles component
- [ ] Add applications section

### Phase 8: Add Subcategory Images to Database
- [ ] Update subcategory records with image URLs (use first product image from each)
- [ ] Or: dynamically fetch first product image in SubcategoryTiles component

---

## Subcategory Tiles Component Spec

```tsx
interface SubcategoryTilesProps {
  categorySlug: string;
  subcategories: Subcategory[];
  title?: string; // defaults to "Search by Type"
}

// Display as grid of tiles:
// - Image from first product in subcategory
// - Subcategory name overlay
// - Link to subcategory page
// - Responsive: 2 cols mobile, 3 cols tablet, 4-5 cols desktop
```

---

## Dependencies

- Database subcategory images OR dynamic product image lookup
- First product image query per subcategory

---

## Notes

- Pipe Repair page is the most different and will require the most work
- Some subcategories may not have images; need fallback
- Rubber Expansion Joints has 10 subcategories - may need to consolidate display or show top 6
- Consider whether to group related subcategories (e.g., "Single Sphere" types)
