# Menu Alignment Audit

**Created**: 2026-01-05
**Type**: fix
**Status**: Complete

## Summary
Ensure all navigation menus (desktop header, mobile header, homepage hero dropdown) have consistent subcategories.

## Scope
- **Impact**: Low
- **Files**: 2 (Header.tsx, page.tsx)
- **Components**: Navigation menus

## Issues Found

| Category | Header Menu | Homepage Hero | Status |
|----------|-------------|---------------|--------|
| Couplings - Muff Couplings | ✅ | ❌ Missing | Fix needed |
| Valves - Duckbill Valves | ✅ | ❌ Missing | Fix needed |

## Phases

### Phase 1: Fix Homepage Hero Menu
- [x] Add Muff Couplings to Couplings & Repair submenu
- [x] Add Duckbill Valves to Valves submenu

### Phase 2: Verify Alignment
- [x] Confirm all menus match
- [x] Test navigation

## Notes
- Footer only shows top-level categories (by design)
- Mobile menu uses same `productsMenu` array as desktop (no separate fix needed)
