# Menu Hover Styling - Teal Background with White Text

**Created**: 2026-01-04
**Type**: enhancement
**Status**: Complete

## Summary
Update all menu hover states to use teal background with white text. This includes main navigation dropdowns, mobile menu items, search result dropdowns, and the product size selector dropdown.

## Scope
- **Impact**: Low (styling only)
- **Files**: ~3 files
- **Components**: Header.tsx, globals.css, select.tsx

## Current State

### Already Working
- `.nav-dropdown-item` class already has teal hover with white text (lines 398-405 in globals.css)
- Desktop dropdown menus use this class

### Needs Update
1. **Select component (product size dropdown)** - Uses `focus:bg-accent focus:text-accent-foreground` instead of teal
2. **Search result dropdown** - Uses `hover:bg-primary/10 hover:text-primary` (teal-tinted but not solid)
3. **Mobile menu items** - Use various hover patterns, need consistency

## Phases

### Phase 1: Update Select Component
- [x] Modify SelectItem in `src/components/ui/select.tsx` to use teal hover with white text

### Phase 2: Update Search Dropdowns
- [x] Update search result buttons in Header.tsx to use consistent teal hover

### Phase 3: Update Mobile Menu
- [x] Update mobile menu item hovers to match desktop dropdown style

### Phase 4: Verify All Menus
- [x] Test desktop navigation dropdowns
- [x] Test product size selector
- [x] Test search results dropdown
- [x] Test mobile menu

## Implementation Notes

### CSS Approach
Use CSS custom properties for consistency:
- Background: `hsl(var(--primary))` (teal)
- Text: `white`

### Files to Modify

1. **src/components/ui/select.tsx** (line 121)
   - Change `focus:bg-accent focus:text-accent-foreground` to `focus:bg-primary focus:text-white`

2. **src/components/Header.tsx** (multiple locations)
   - Search results: lines 197, 206, 463
   - Mobile menu items: lines 483, 504, 517, 526, 546

3. **src/app/globals.css**
   - Already has correct `.nav-dropdown-item` styling
   - May add global select item styling for consistency

## Notes
- The primary color is already teal (defined in CSS variables)
- Using `!important` on color may be needed to override Radix defaults
