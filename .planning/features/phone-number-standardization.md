# Phone Number Standardization

**Created**: 2026-01-02
**Type**: Enhancement
**Status**: Planning

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
- [ ] `src/components/Header.tsx`
- [ ] `src/components/Footer.tsx`
- [ ] `src/components/USPBar.tsx`
- [ ] `src/components/JsonLd.tsx`

### Pages
- [ ] `src/app/page.tsx` (homepage)
- [ ] `src/app/contact/page.tsx`
- [ ] `src/app/request-quote/page.tsx`

### Category Pages
- [ ] `src/app/valves/page.tsx`
- [ ] `src/app/pipe-couplings/page.tsx`
- [ ] `src/app/flange-adaptors/page.tsx`
- [ ] `src/app/pipe-repair/page.tsx`
- [ ] `src/app/rubber-expansion-joints/page.tsx`
- [ ] `src/app/strainers/page.tsx`
- [ ] `src/app/industries/[industry]/page.tsx`

### Brand Pages
- [ ] `src/app/straub/page.tsx`
- [ ] `src/app/teekay/page.tsx`
- [ ] `src/app/orbit/page.tsx`

### API Routes
- [ ] `src/app/api/quote/route.ts`
- [ ] `src/app/api/contact/route.ts`

### Tests
- [ ] `tests/navigation/header.spec.ts`
- [ ] `tests/navigation/footer.spec.ts`
- [ ] `tests/forms/contact-form.spec.ts`

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
