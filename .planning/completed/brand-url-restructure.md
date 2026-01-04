# Brand URL Restructure

**Created**: 2026-01-05
**Completed**: 2026-01-05
**Type**: enhancement
**Status**: Complete

## Summary

Restructure brand pages to use product-focused flat URLs:
- `/straub` → `/straub-couplings-repair-clamps`
- `/orbit` → `/orbit-couplings` (already exists conceptually)
- Remove `/brands/straub` and `/brands/orbit` (use dynamic [brand] route only for other brands)
- Create new flat strainer pages: `/duplex-basket-strainers`, `/flanged-suction-strainers`
- Update all internal links (no redirects)
- Update sitemap to auto-generate from database

## Scope

- **Impact**: Medium
- **Files**: ~15 files
- **Components**: Header, Footer, brand pages, sitemap, various linking pages

## Phases

### Phase 1: Create New Pages ✅
- [x] Create `/straub-couplings-repair-clamps/page.tsx` (copy from /straub with URL updates)
- [x] Rename `/orbit` to `/orbit-couplings`
- [x] Create `/duplex-basket-strainers/page.tsx` (subcategory page)
- [x] Create `/flanged-suction-strainers/page.tsx` (subcategory page)

### Phase 2: Update All Internal Links ✅
- [x] `src/components/Header.tsx` - brandsMenu
- [x] `src/components/Footer.tsx` - brand links
- [x] `src/app/page.tsx` - homepage links
- [x] `src/app/pipe-couplings/page.tsx` - related links
- [x] `src/app/brands/page.tsx` - brand cards
- [x] `src/app/industries/[industry]/page.tsx` - brand references

### Phase 3: Delete Old Pages ✅
- [x] Delete `/straub/page.tsx` (replaced by /straub-couplings-repair-clamps)
- [x] Delete `/orbit/page.tsx` (replaced by /orbit-couplings)

### Phase 4: Update Sitemap ✅
- [x] Make sitemap fully dynamic (reads brands from database)
- [x] Updated subcategory mappings for flat URLs
- [x] Brand URL mapping for Straub/Orbit vs other brands

### Phase 5: Verify & Test ✅
- [x] Build passes (227 pages)
- [x] All internal links updated
- [x] Sitemap includes all new URLs
- [x] No 404s

## Files Affected

| File | Changes |
|------|---------|
| `src/app/straub-couplings-repair-clamps/page.tsx` | NEW - copy of /straub |
| `src/app/orbit-couplings/page.tsx` | NEW - move from /orbit |
| `src/app/duplex-basket-strainers/page.tsx` | NEW - subcategory page |
| `src/app/flanged-suction-strainers/page.tsx` | NEW - subcategory page |
| `src/app/straub/page.tsx` | DELETE |
| `src/app/orbit/page.tsx` | DELETE (after move) |
| `src/components/Header.tsx` | Update brand URLs |
| `src/components/Footer.tsx` | Update brand URLs |
| `src/app/brands/page.tsx` | Update Straub/Orbit URLs |
| `src/app/sitemap.ts` | Make fully dynamic |
| + ~5 other files with brand links |

## Notes

- No redirects - all links updated directly
- Sitemap should auto-generate from database queries
- `/brands/[brand]` dynamic route remains for: teekay, bore-flex-rubber, defender-valves, defender-strainers
- Straub and Orbit get dedicated flat pages at root level
