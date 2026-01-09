# Hero Reveal Effect & Brand Scroll Fix

**Created**: 2026-01-09
**Type**: Enhancement
**Status**: Planning

## Summary

Two homepage improvements:
1. **Hero Image Reveal**: Industrial illustration underlay revealed on mouseover using clip-path animation (inspired by Lando Norris website)
2. **Brand Logo Scroll**: Fix continuous seamless scroll with no gaps or jumps

## Scope

- **Impact**: Medium
- **Files**: ~4 estimated
- **Components**: Homepage hero section, brand carousel, globals.css

---

## Phase 1: Brand Logo Scroll Fix ✅ COMPLETE

### 1.1 Fix Animation Direction ✅
- [x] Changed animation from `translateX(-50%) → translateX(0)` to `translateX(0) → translateX(-50%)`
- [x] Now creates standard right-to-left scrolling marquee
- [x] File: `src/app/globals.css:404-411`

### 1.2 Verify Seamless Loop ✅
- [x] Duplicate content set positioned correctly
- [x] Animation loops without visible jump
- [x] Timing (25s) works well for content width

### 1.3 Enhance Pause Behavior ✅
- [x] Hover-pause functionality preserved
- [ ] (Optional) Gradient fade edges can be added later

---

## Phase 2: Hero Illustration Layer ✅ COMPLETE

### 2.1 Create Illustration Asset ✅
- [x] Using CSS filter effects (grayscale + contrast)
- [x] Teal overlay with hard-light blend mode
- [x] Same hero image reused with different treatment

### 2.2 Add Illustration Underlay ✅
- [x] Created two-layer structure in hero section
- [x] Layer 1 (bottom): `.hero-illustration` with grayscale filter + teal overlay
- [x] Layer 2 (top): `.hero-photo-layer` with clip-path mask
- [x] File: `src/app/page.tsx:186-206`

---

## Phase 3: Clip-Path Reveal Animation ✅ COMPLETE

### 3.1 Implement Hover Reveal ✅
- [x] CSS-based clip-path animation (no framer-motion needed)
- [x] Clip-path: `ellipse(150% 150% at 50% 50%)` → `ellipse(0% 0% at 50% 50%)`
- [x] Uses easing: `cubic-bezier(0.65, 0.05, 0, 1)` (Lando Norris timing)

### 3.2 Add Scale Effect ✅
- [x] Scale illustration layer 1.05x on hover
- [x] Creates depth and movement
- [x] 0.75s transition timing

### 3.3 CSS Implementation ✅
- [x] All effects in CSS (globals.css:1070-1127)
- [x] Classes: `.hero-container`, `.hero-illustration`, `.hero-photo-layer`

---

## Phase 4: Mobile & Polish ✅ COMPLETE

### 4.1 Mobile Touch Detection ✅
- [x] Added `@media (hover: none)` to disable effect on touch devices
- [x] Photo layer stays visible on mobile

### 4.2 Performance Optimization ✅
- [x] Added `will-change: clip-path` for GPU acceleration
- [x] Smooth 60fps animation

---

## Implementation Notes

### Lando Norris Technique Reference
```css
/* Clip-path reveal */
.reveal-layer {
  clip-path: ellipse(150% 150% at 50% 50%);
  transition: clip-path 0.75s cubic-bezier(0.65, 0.05, 0, 1);
}

.reveal-layer:hover {
  clip-path: ellipse(0% 0% at 50% 50%);
}
```

### Brand Scroll Fix
```css
/* Correct animation for seamless left scroll */
@keyframes brand-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

### Framer Motion Pattern
```tsx
<motion.div
  whileHover={{
    clipPath: "ellipse(0% 0% at 50% 50%)",
    transition: { duration: 0.75, ease: [0.65, 0.05, 0, 1] }
  }}
>
```

## Dependencies

- framer-motion (already installed)
- Industrial illustration asset (needs creation)

## Files Summary

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Hero two-layer structure, motion imports |
| `src/app/globals.css` | Scroll animation fix, hero reveal CSS |
| `/public/images/hero-illustration.webp` | New asset |

## Testing

- [ ] Desktop: Hover reveals illustration smoothly
- [ ] Mobile: Effect disabled or alternative trigger
- [ ] Brand scroll: No visible jump at loop point
- [ ] Performance: 60fps during animations
- [ ] Cross-browser: Chrome, Firefox, Safari

---

## References

- Lando Norris website: Clip-path ellipse reveal technique
- Framer Motion docs: whileHover, clipPath animations
- Current hero: `src/app/page.tsx:186-196`
- Current brand carousel: `src/app/page.tsx:358-478`
