# Phone Number Standardization

**Created**: 2026-01-02
**Updated**: 2026-01-04
**Type**: Enhancement
**Status**: ✅ Complete

## Summary

Replace all instances of the local Perth number `(08) 9271 2577` with the national 1300 number `1300 271 290` across the entire website. This provides a consistent, professional contact number for customers Australia-wide.

## Scope

- **Impact**: Low (content change only, no logic changes)
- **Files**: ~22 files
- **Components**: Header, Footer, USPBar, category pages, brand pages, API routes, tests

## Current State

- Local number `(08) 9271 2577` used in ~22 files
- 1300 number `1300 271 290` already exists in catalog data
- Inconsistent contact information across site

## Target State

- Single 1300 number `1300 271 290` used everywhere
- Consistent `tel:` href format: `tel:1300271290`
- Updated display format: `1300 271 290`

## Files to Update

### Core Components
- [x] `src/components/Header.tsx`
- [x] `src/components/Footer.tsx`
- [x] `src/components/USPBar.tsx`
- [x] `src/components/JsonLd.tsx`

### Pages
- [x] `src/app/page.tsx` (homepage)
- [x] `src/app/contact/page.tsx`
- [x] `src/app/request-quote/page.tsx`

### Category Pages
- [x] `src/app/valves/page.tsx`
- [x] `src/app/pipe-couplings/page.tsx`
- [x] `src/app/flange-adaptors/page.tsx`
- [x] `src/app/pipe-repair/page.tsx`
- [x] `src/app/rubber-expansion-joints/page.tsx`
- [x] `src/app/strainers/page.tsx`
- [x] `src/app/industries/[industry]/page.tsx`

### Brand Pages
- [x] `src/app/straub/page.tsx`
- [x] `src/app/teekay/page.tsx`
- [x] `src/app/orbit/page.tsx`

### API Routes
- [x] `src/app/api/quote/route.ts`
- [x] `src/app/api/contact/route.ts`

### Tests
- [x] `tests/navigation/header.spec.ts`
- [x] `tests/navigation/footer.spec.ts`
- [x] `tests/forms/contact-form.spec.ts`

**Verified 2026-01-04**: All 40+ instances using 1300 271 290. No old Perth number found.

## Replacement Patterns

| Old Pattern | New Pattern |
|-------------|-------------|
| `(08) 9271 2577` | `1300 271 290` |
| `tel:0892712577` | `tel:1300271290` |
| `08 9271 2577` | `1300 271 290` |

## Notes

- Do not update files in `_replit_backup/` or `.planning/audit/`
- Verify `tel:` links work correctly after change
- Check mobile click-to-call functionality
