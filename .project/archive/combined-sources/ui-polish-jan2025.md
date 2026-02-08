# UI Polish & Improvements - January 2025

**Created**: 2025-01-09
**Type**: Enhancement
**Status**: Planning

## Summary

Collection of UI/UX improvements including text color fixes on brand pages, button removal from category pages, improved product tile hover states, chrome email animation, hero section refinements, and site-wide link validation.

## Scope

- **Impact**: Medium
- **Files**: ~15 estimated
- **Components**: Brand pages, Category pages, ProductCard, Header, Homepage hero, globals.css

---

## Phase 1: Brand & Category Page Fixes ✅ COMPLETE

### 1.1 Orbit Couplings Text Color ✅
- [x] Change description text from `text-orange-800/80` to `text-black` on `/orbit-couplings`
- [x] File: `src/app/orbit-couplings/page.tsx:152`

### 1.2 Confine Hero Blob Effect to Hero Section ✅
- [x] Brand pages (straub, bore-flex) had animated blobs extending beyond hero
- [x] Moved blob containers inside hero div with `overflow-hidden`
- [x] Files fixed:
  - `src/app/straub-couplings/page.tsx`
  - `src/app/bore-flex/page.tsx`

### 1.3 Remove Hero Buttons from Category Pages ✅
- [x] Removed "View Products" and "Request a Quote" buttons from category page heroes
- [x] Files updated:
  - `src/app/pipe-couplings/page.tsx`
  - `src/app/pipe-repair/page.tsx` (kept Emergency phone button)
  - `src/app/expansion-joints/page.tsx`
  - `src/app/strainers/page.tsx`
  - `src/app/industrial-valves/page.tsx`
  - `src/app/flange-adaptors/page.tsx`
  - `src/app/pipe-repair-clamps/page.tsx`

---

## Phase 2: Product Tile Hover Improvements

### 2.1 Higher Contrast "View Product" Text
- [ ] Update `.view-product-shimmer` CSS for better legibility
- [ ] Current: `color: rgba(128, 128, 128, 0.7); mix-blend-mode: difference;`
- [ ] Target: Higher contrast with better visibility on all image backgrounds
- [ ] Consider: Dark semi-transparent background behind text
- [ ] File: `src/app/globals.css:1005`

---

## Phase 3: Email Chrome Animation

### 3.1 Add Chrome Shimmer to Email Text
- [ ] Apply chrome animation effect to email address in Header
- [ ] File: `src/components/Header.tsx:276-278`
- [ ] Use existing `.chrome-text` class or create variant
- [ ] Consider mobile version at line 766-770

---

## Phase 4: Hero Section Refinements

### 4.1 Lighten Hero Image Overlay
- [ ] Current: `bg-gradient-to-r from-black/60 to-black/50`
- [ ] Target: Lighter overlay for better image visibility
- [ ] File: `src/app/page.tsx:195`

### 4.2 Brighter Search Bar with Depth
- [ ] Current: `border-2 border-primary/30`
- [ ] Target: More prominent border, inset shadow for depth effect
- [ ] File: `src/app/page.tsx:214`
- [ ] Add: `shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]` or similar

### 4.3 Category Pills - Solid Teal Hover + Magnetic Effect
- [ ] Current: `bg-white/5 hover:border-white/20`
- [ ] Target: Solid teal background on hover
- [ ] Add magnetic/snap effect on hover (CSS transform or JS)
- [ ] File: `src/app/page.tsx:255` (DropdownMenuTrigger elements)

---

## Phase 5: Link Validation

### 5.1 Breadcrumb Link Audit
- [ ] Check all BreadcrumbJsonLd URLs are correct
- [ ] Files using breadcrumbs:
  - `src/app/orbit-couplings/page.tsx:123-126`
  - `src/app/straub-couplings/page.tsx`
  - `src/app/teekay/page.tsx:110-113` (uses dewater-products.vercel.app - needs fix)
  - `src/app/pipe-couplings/page.tsx:246-249` (uses dewater-products.vercel.app - needs fix)
  - All category/product pages

### 5.2 Site-Wide Broken Link Check
- [ ] Run Playwright or crawler to check all internal links
- [ ] Check external links (PDF downloads, etc.)
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
| `src/app/orbit-couplings/page.tsx` | Text color |
| `src/app/pipe-couplings/page.tsx` | Remove buttons |
| `src/app/page.tsx` | Hero overlay, search bar, pills |
| `src/app/globals.css` | View product shimmer |
| `src/components/Header.tsx` | Email chrome effect |
| Multiple pages | Breadcrumb URL fixes |

### Testing
- [ ] Visual check on all brand pages
- [ ] Product tile hover on light/dark images
- [ ] Hero section on mobile and desktop
- [ ] Run link checker tool

---

## Dependencies

- None - all changes are CSS/styling

## References

- Chrome text effect: `globals.css:630-656`
- Product card: `src/components/ProductCard.tsx:75-80`
- Hero search: `src/app/page.tsx:201-250`
