# Homepage & UI Polish

**Created**: 2026-01-10
**Type**: Enhancement
**Status**: Active
**Combined from**:
  - hero-reveal-brand-scroll.md
  - search-bar-dot-font-styling.md
  - ui-polish-jan2025.md

## Summary

Consolidated UI/UX improvements for the homepage and site-wide polish. Includes hero section refinements, search bar styling, and visual enhancements across brand and category pages.

## Scope

- **Impact**: Medium
- **Files**: ~10-15 (page.tsx, Header.tsx, globals.css, brand pages)
- **Components**: Hero section, search bars, product tiles, category pills

---

## Phase 1: Hero Section Polish

### 1.1 Hero Overlay & Image
- [ ] Lighten hero image overlay from `bg-gradient-to-r from-black/60` to lighter value
- [ ] Test image visibility with different overlay values

### 1.2 Search Bar Enhancements
- [ ] Increase border brightness from `border-primary/30` to `border-primary`
- [ ] Add depth shadow: `shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]`
- [ ] Update focus states for better visibility
- [ ] File: `src/app/page.tsx:214`

### 1.3 Category Pills - Teal Hover
- [ ] Add solid teal background on hover
- [ ] Consider magnetic/snap effect on hover
- [ ] File: `src/app/page.tsx:255`

---

## Phase 2: Search Bar Font Update

### 2.1 Font Configuration (Complete) ✅
- [x] Import DotGothic16 from Google Fonts in layout.tsx
- [x] Configure CSS variable for dot font
- [x] Remove laser scanning border wrapper div
- [x] Remove chrome-text class from input

### 2.2 Apply Font & Styling
- [ ] Add dot font class to hero search input
- [ ] Add dot font class to header search input
- [ ] Update header search border to match hero brightness
- [ ] Test responsive behavior on mobile

### 2.3 Cleanup
- [ ] Remove unused .chrome-text styles from globals.css
- [ ] Remove unused .laser-scan-border styles from globals.css
- [ ] Remove unused @keyframes chrome-shine animation
- [ ] Remove unused @keyframes laser-scan animation

---

## Phase 3: Product Tile Improvements

### 3.1 View Product Text
- [ ] Update `.view-product-shimmer` CSS for better legibility
- [ ] Current: `color: rgba(128, 128, 128, 0.7); mix-blend-mode: difference;`
- [ ] Target: Higher contrast with visibility on all backgrounds
- [ ] Consider dark semi-transparent background behind text
- [ ] File: `src/app/globals.css:1005`

---

## Phase 4: Header Email Animation

### 4.1 Chrome Shimmer Effect
- [ ] Apply chrome animation to email address in Header
- [ ] File: `src/components/Header.tsx:276-278`
- [ ] Consider mobile version at line 766-770

---

## Phase 5: Brand Scroll (Complete) ✅

- [x] Fixed animation direction: `translateX(0) → translateX(-50%)`
- [x] Creates standard right-to-left scrolling marquee
- [x] Seamless loop verified, timing (25s) works well

---

## Phase 6: Link Validation

### 6.1 Breadcrumb URL Audit
- [ ] Check all BreadcrumbJsonLd URLs are correct
- [ ] Fix teekay page (uses dewater-products.vercel.app)
- [ ] Fix pipe-couplings page (uses dewater-products.vercel.app)

### 6.2 Site-Wide Broken Link Check
- [ ] Run Playwright or crawler to check all internal links
- [ ] Verify 404 handling is working
- [ ] Document any broken links found

---

## Implementation Notes

### CSS Classes Available
- `.chrome-text` - Animated gradient text effect (globals.css:630)
- `.view-product-shimmer` - Product tile hover text (globals.css:1005)
- `.btn-swipe-*` - Button hover animations

### Files Summary
| File | Changes |
|------|---------|
| `src/app/page.tsx` | Hero overlay, search bar, pills |
| `src/components/Header.tsx` | Email chrome effect, search styling |
| `src/app/globals.css` | View product shimmer, cleanup old styles |
| `src/app/layout.tsx` | Font configuration (done) |

---

## Source References
- Original: `.planning/combined-sources/hero-reveal-brand-scroll.md`
- Original: `.planning/combined-sources/search-bar-dot-font-styling.md`
- Original: `.planning/combined-sources/ui-polish-jan2025.md`

---

Last Updated: 2026-01-10
