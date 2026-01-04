# URL Restructure: Flat Architecture

**Created**: 2026-01-04
**Type**: enhancement
**Status**: In Progress

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

### Phase 1: Create New Route Structure
- [ ] Rename `/valves` → `/industrial-valves`
- [ ] Create flat subcategory routes for valves
- [ ] Create flat subcategory routes for expansion-joints
- [ ] Create flat subcategory routes for strainers
- [ ] Consolidate brand pages under `/brands/`

### Phase 2: Update Navigation
- [ ] Update Header.tsx productsMenu with new URLs
- [ ] Update Header.tsx brandsMenu with new URLs
- [ ] Update mobile menu links
- [ ] Update Footer.tsx links

### Phase 3: Add Redirects (Old → New)
- [ ] Add redirects in middleware.ts for old URLs
- [ ] Remove conflicting redirects from next.config.js
- [ ] Test all redirect chains

### Phase 4: Update Internal Links
- [ ] Update homepage links
- [ ] Update category page cross-links
- [ ] Update product page breadcrumbs
- [ ] Update any hardcoded links in components

### Phase 5: SEO & Testing
- [ ] Update canonical URLs in metadata
- [ ] Update sitemap generation
- [ ] Test all navigation paths
- [ ] Verify no redirect loops

## Notes

- Products are already flat at `/{slug}` - no change needed
- Need 301 redirects from old URLs to preserve SEO equity
- Mobile menu and desktop menu need parallel updates
