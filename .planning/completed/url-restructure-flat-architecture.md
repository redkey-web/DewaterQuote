# URL Restructure: Flat Architecture

**Created**: 2026-01-04
**Updated**: 2026-01-04
**Type**: enhancement
**Status**: Complete

## Summary

Restructure site URLs to use a flat architecture for better SEO crawl efficiency. Categories become generic (not brand-focused), subcategories move to root level, and brand pages stay under `/brands/`.

## Current vs New Structure

### Categories (Parent Pages)

| Current | New | Notes |
|---------|-----|-------|
| `/valves` (Defender Valves) | `/industrial-valves` | Generic, SEO-focused |
| `/pipe-couplings` | `/pipe-couplings` | Keep as-is |
| `/pipe-repair` | `/pipe-repair` | Keep as-is |
| `/flange-adaptors` | `/flange-adaptors` | Keep as-is |
| `/expansion-joints` | `/expansion-joints` | Keep as-is |
| `/strainers` | `/strainers` | Keep as-is |

### Subcategories (Flat at Root)

| Current | New |
|---------|-----|
| `/valves/butterfly-valve` | `/butterfly-valves` |
| `/valves/check-valves` | `/check-valves` |
| `/valves/gate-valve` | `/gate-valves` |
| `/valves/ball-valve` | `/ball-valves` |
| `/valves/float-valve` | `/float-valves` |
| `/valves/foot-valve` | `/foot-valves` |
| `/expansion-joints/single-sphere` | `/single-sphere-expansion-joints` |
| `/expansion-joints/twin-sphere` | `/twin-sphere-expansion-joints` |
| `/expansion-joints/single-arch` | `/single-arch-expansion-joints` |
| `/expansion-joints/double-arch` | `/double-arch-expansion-joints` |
| `/expansion-joints/reducing` | `/reducing-expansion-joints` |
| `/strainers/y-strainer` | `/y-strainers` |
| `/strainers/simplex-basket-strainer` | `/basket-strainers` |
| `/strainers/duplex-basket-strainer` | `/duplex-basket-strainers` |
| `/strainers/flanged-suction-strainer` | `/suction-strainers` |

### Brands (Under /brands/)

| Current | New |
|---------|-----|
| `/straub` | `/brands/straub` |
| `/orbit` | `/brands/orbit` |
| `/teekay` | `/brands/teekay` |
| `/brands/bore-flex-rubber` | `/brands/bore-flex` |
| `/brands/defender-valves` | `/brands/defender` |
| `/brands/defender-strainers` | (merge into `/brands/defender`) |

### Products (Already Flat - Keep)

Products already at `/{product-slug}` - no change needed.

## Scope

- **Impact**: High (URL structure change)
- **Files**: ~25 estimated
- **Components**: Header, Footer, category pages, subcategory pages

## Phases

### Phase 1: Create New Route Structure ✅
- [x] Rename `/valves` → `/industrial-valves`
- [x] Create flat subcategory routes for valves
- [x] Create flat subcategory routes for expansion-joints
- [x] Create flat subcategory routes for strainers
- [x] Brand pages already under `/brands/`

### Phase 2: Update Navigation ✅
- [x] Update Header.tsx productsMenu with new URLs
- [x] Update Header.tsx brandsMenu with new URLs
- [x] Update mobile menu links
- [x] Update Footer.tsx links

### Phase 3: Redirects ✅
- [x] No redirects - all links updated to flat URLs directly
- [x] Removed all redirects from middleware.ts and next.config.js
- [x] Site uses direct links only (no redirect chains)

### Phase 4: Update Internal Links ✅
- [x] Update homepage links
- [x] Update category page cross-links (industries, teekay pages)
- [x] Update SubcategoryTiles with urlMap prop
- [x] Update any hardcoded links in components

### Phase 5: SEO & Testing ✅
- [x] All pages use flat URLs in metadata
- [x] Sitemap generates flat URLs
- [x] Test all navigation paths
- [x] Verify no redirect loops (no redirects at all)

## Notes

- Products are already flat at `/{slug}` - no change needed
- Need 301 redirects from old URLs to preserve SEO equity
- Mobile menu and desktop menu need parallel updates
