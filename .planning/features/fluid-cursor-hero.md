# Fluid Cursor Hero Effect

**Created**: 2026-01-09
**Type**: Enhancement
**Status**: Complete
**Replaces**: hero-reveal-brand-scroll.md (Phase 2-3 clip-path reveal)

## Summary

Replace the simple CSS clip-path hover reveal with a sophisticated "fluid cursor" displacement effect. Mouse movement dynamically reveals an industrial illustration underneath the hero photo using a depth map-driven parallax displacement.

## Technical Approach

**Primary Method**: CSS mask-image with radial gradient
- GPU-accelerated via CSS, no canvas processing needed
- Smooth 60fps performance
- Simple integration with React state

**How It Works**:
1. Two images layered: photo (base) and industrial illustration (reveal)
2. CSS `mask-image: radial-gradient()` reveals illustration at mouse position
3. Mouse position drives mask center coordinates with easing
4. Smooth animation via requestAnimationFrame with lerp easing

## Assets

| Asset | Source | Path |
|-------|--------|------|
| Hero Photo | Existing | `/public/images/hero-pipeline.webp` |
| Industrial Illustration | Downloaded | `/public/images/hero-illustration-industrial.png` |
| Depth Map | To generate | `/public/images/hero-depthmap.png` |

---

## Phase 1: Asset Preparation

### 1.1 Copy Industrial Illustration
- [x] Copy `Gemini_Generated_Image_bvv0mubvv0mubvv0.png` to project
- [x] Rename to `hero-illustration-industrial.png`
- [x] Path: `/public/images/hero-illustration-industrial.png`

### 1.2 Generate Depth Map
- [x] Created grayscale depth map from illustration
- [x] Brightness = depth (white = far, black = near)
- [x] Saved as `/public/images/hero-depthmap.png`
- Note: Depth map generated but not used in final CSS mask implementation

### 1.3 Optimize Images for Web
- [x] Converted illustration to WebP for production
- [x] Files: `hero-illustration-industrial.webp`, `hero-depthmap.webp`

---

## Phase 2: FluidHero Component ✅ COMPLETE

### 2.1 Create Component Structure
- [x] Created `/src/components/FluidHero.tsx`
- [x] CSS mask-based implementation (not canvas)
- [x] Accept image URLs and radius as props
- [x] Handles mouse enter/leave states

### 2.2 Core Implementation
```tsx
interface FluidHeroProps {
  photoSrc: string
  illustrationSrc: string
  radius?: number // reveal radius in pixels
  className?: string
  children?: React.ReactNode
}
```

---

## Phase 3: Mouse Interaction ✅ COMPLETE

### 3.1 Mouse Tracking
- [x] Track mouse position relative to container
- [x] Smooth easing via lerp (0.12 factor)
- [x] requestAnimationFrame for fluid animation

### 3.2 CSS Mask Reveal
- [x] Radial gradient mask centered on mouse
- [x] Configurable radius (default 320px)
- [x] Soft falloff (40% solid, gradient to transparent)

---

## Phase 4: Integration ✅ COMPLETE

### 4.1 Replace Existing Hero
- [x] Swapped CSS clip-path hero with FluidHero
- [x] Maintained text content and search bar
- [x] Z-index layering works correctly

### 4.2 Mobile Handling
- [x] Detect touch devices via `(hover: none)` media query
- [x] Effect disabled on mobile (shows photo only)
- [x] No performance impact on mobile

---

## Phase 5: Polish & Performance ✅ COMPLETE

### 5.1 Performance
- [x] GPU-accelerated CSS mask (no JS image processing)
- [x] Smooth 60fps animation
- [x] Minimal state updates

### 5.2 Visual Polish
- [x] Smooth opacity transition on hover enter/leave
- [x] Subtle teal tint overlay on revealed area
- [x] Gradient overlay maintained for text readability

---

## Implementation Notes

### Displacement Filter Concept
```javascript
// Pseudo-code for displacement
function displace(photoData, illustrationData, depthData, mouseX, mouseY) {
  for (let i = 0; i < photoData.length; i += 4) {
    const x = (i / 4) % width
    const y = Math.floor((i / 4) / width)

    // Distance from mouse
    const dist = Math.sqrt((x - mouseX)**2 + (y - mouseY)**2)

    // Depth value (0-255)
    const depth = depthData[i] / 255

    // Displacement amount (higher near mouse, scaled by depth)
    const factor = Math.max(0, 1 - dist / radius) * depth * intensity

    // Blend photo and illustration based on factor
    outputData[i] = lerp(photoData[i], illustrationData[i], factor)
    outputData[i+1] = lerp(photoData[i+1], illustrationData[i+1], factor)
    outputData[i+2] = lerp(photoData[i+2], illustrationData[i+2], factor)
    outputData[i+3] = 255
  }
}
```

### Alternative: CSS mask-image Approach
If performance is an issue, consider simpler CSS approach:
```css
.fluid-reveal {
  mask-image: radial-gradient(
    circle at var(--mouse-x) var(--mouse-y),
    black 0%,
    transparent 200px
  );
}
```
This is less sophisticated but much lighter weight.

---

## Dependencies

- None required (pure CSS + React state)

## Files Summary

| File | Changes |
|------|---------|
| `/src/components/FluidHero.tsx` | New component (CSS mask-based) |
| `/src/app/page.tsx` | Replaced hero section with FluidHero |
| `/public/images/hero-illustration-industrial.png` | New asset (9.3MB PNG) |
| `/public/images/hero-illustration-industrial.webp` | WebP version for production |
| `/public/images/hero-depthmap.png` | Generated (unused in final) |
| `/scripts/generate-depthmap.ts` | Depth map generation script |

---

## References

- PixiJS DisplacementFilter docs
- [Weekend Projects - Pixi.js Displacement](https://weekendprojects.dev/posts/create-a-follow-me-effect-with-pixi.js-and-displacement-filters/)
- [3D Photo Depth Effect](https://luungoc2005.github.io/blog/2020-06-30-minimal-3d-photo-effect/)
- Current hero: `src/app/page.tsx:186-206`
