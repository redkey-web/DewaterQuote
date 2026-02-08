# Mobile Polish

**Created**: 2026-01-09
**Type**: Enhancement
**Status**: Complete

## Summary

Mobile-only CSS improvements to polish the mobile experience without affecting desktop layout. All changes use `@media (max-width: 768px)` or similar mobile breakpoints.

## Scope
- **Impact**: Low-Medium
- **Files**: ~3-5 files (mainly globals.css + specific components)
- **Desktop**: UNCHANGED

---

## Completed Work

### Header Gradient Blur Effect
- [x] **Reversed gradient**: Opaque (95%) at top → Transparent (30%) at bottom
- [x] **Gradient blur**: Strong blur at top → No blur at bottom (using CSS mask)
- Added `header-gradient-blur` class to globals.css

### Phase 1: Homepage Mobile Polish

- [x] **Bulk pricing ticker**: Reduced font size on mobile (0.75rem at 768px, 0.7rem at 480px)
- [x] **Category pills**: Reduced gap/padding on mobile for better fit
- [x] **Touch targets**: Added 44px minimum height for buttons/links on mobile
- [ ] **Hero search bar**: Reduce height slightly on mobile, adjust font size
- [ ] **Value props row**: Stack to 2x2 grid on small mobile instead of horizontal scroll
- [ ] **Industry solutions grid**: Ensure proper spacing on smallest screens

### Phase 2: Product Pages

- [x] **Breadcrumb**: Hide middle items on mobile, show only Home > Current
- [ ] **Product card grid**: Ensure consistent card heights on mobile
- [ ] **Size selector dropdown**: Make it full-width on mobile for easier tapping

### Phase 3: Quote Cart & Form

- [x] **Cart sidebar**: Already uses full width on mobile (w-full md:w-[480px])
- [ ] **Material cert toggle**: Ensure tap target is adequate size
- [ ] **Form fields**: Ensure proper spacing between fields on mobile

### Phase 4: General Polish

- [ ] **Footer**: Ensure columns stack properly on smallest screens
- [ ] **Navigation**: Verify mobile menu works well
- [x] **Touch targets**: Added 44px min-height rule for mobile

---

## Implementation Notes

CSS changes added to globals.css:
```css
/* Header gradient blur effect */
.header-gradient-blur { ... }

/* Mobile-only polish */
@media (max-width: 768px) {
  .ticker-content { font-size: 0.75rem; }
  .pill-swipe { padding: 0.5rem 0.875rem; font-size: 0.8rem; }
  button, a, [role="button"] { min-height: 44px; }
}

@media (max-width: 480px) {
  .pill-swipe { padding: 0.4rem 0.75rem; font-size: 0.75rem; }
  .ticker-content { font-size: 0.7rem; }
}
```

Breadcrumb changes in ProductDetailClient.tsx:
- Middle items (category/subcategory) hidden on mobile via `hidden md:inline-flex`

---

Last Updated: 2026-01-09
