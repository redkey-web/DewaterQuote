# Search Bar Google Sans Code Font Update

**Created**: 2026-01-09
**Type**: Enhancement - Styling
**Status**: ✅ Phase 1-2 Complete

## Summary

Update both hero and header search bars to use Google Sans Code monospace font with brightened borders. Remove laser scanning animation effect and chrome text gradient. Apply clean, technical aesthetic to search functionality.

## Scope

- **Impact**: Low-Medium (visual styling only, no functionality changes)
- **Files**: ~4 files estimated
- **Components**:
  - Hero search bar (src/app/page.tsx)
  - Header search bar (src/components/Header.tsx)
  - Global styles (src/app/globals.css)
  - Font configuration (src/app/layout.tsx)

## Current State

**Hero Search** (`src/app/page.tsx:252-272`):
- Chrome text effect with teal/purple gradient
- Laser scanning border animation
- Border: `border-2 border-primary/30`
- Font: Inter bold with `.chrome-text` class

**Header Search** (`src/components/Header.tsx:234`):
- Standard styling without chrome effect
- Shimmer effect on focus
- Font: Regular sans-serif

**Current Chrome Text Effect** (`src/app/globals.css:519-546`):
- Animated gradient: teal → cyan → purple → bright purple → teal
- Background clip to text
- Transparent text fill
- 3s animation loop

**Current Laser Border** (`src/app/globals.css:549-573`):
- Rotating conic gradient
- Teal/purple color scheme
- 2.5s animation loop
- 1px blur effect

## Phases

### Phase 1: Font Setup ✅ COMPLETE
- [x] Research dot matrix font (DotGothic16 confirmed)
- [x] Import DotGothic16 from Google Fonts in layout.tsx
- [x] Configure CSS variable for dot font
- [x] Test font loading and rendering

### Phase 2: Hero Search Bar Updates ⚡ IN PROGRESS
- [x] Remove laser scanning border wrapper div
- [x] Remove chrome-text class from input
- [x] Add dot font class to input
- [ ] Increase border brightness from `border-primary/30` to `border-primary`
- [ ] Add additional brightness with border glow or shadow
- [ ] Test search functionality still works
- [ ] Verify placeholder text is readable

### Phase 3: Header Search Bar Updates
- [ ] Add dot font class to header search input
- [ ] Update header search border to match hero brightness
- [ ] Remove search-shimmer if conflicts with new style
- [ ] Test responsive behavior on mobile
- [ ] Verify dropdown results positioning

### Phase 4: Cleanup & Polish
- [ ] Remove unused .chrome-text styles from globals.css
- [ ] Remove unused .laser-scan-border styles from globals.css
- [ ] Remove unused @keyframes chrome-shine animation
- [ ] Remove unused @keyframes laser-scan animation
- [ ] Add focus states for dot font inputs
- [ ] Test in Chrome, Firefox, Safari
- [ ] Verify mobile search experience

### Phase 5: Font Usage Review (Optional)
- [ ] Document current font usage sitewide
- [ ] Identify any other areas using chrome-text effect
- [ ] Consider if Inter bold should be used elsewhere
- [ ] User confirmation on sitewide font adjustments

## Implementation Details

### DotGothic16 Import
```typescript
// src/app/layout.tsx
import { Inter, DotGothic16 } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dot"
})
```

### CSS Variable
```css
/* src/app/globals.css */
:root {
  --font-dot: 'DotGothic16', monospace;
}

.font-dot {
  font-family: var(--font-dot);
}
```

### Brightened Border
```tsx
// Replace: border-2 border-primary/30
// With: border-2 border-primary shadow-[0_0_12px_rgba(59,156,165,0.6)]
// Or: border-3 border-primary/90 shadow-[0_0_16px_rgba(59,156,165,0.7)]
```

### Hero Search Input (New)
```tsx
<input
  ref={heroInputRef}
  type="text"
  placeholder="Search pipe fittings, valves, couplings..."
  className="relative w-full h-14 md:h-16 pl-14 pr-6 text-lg font-dot rounded-2xl bg-white border-3 border-primary shadow-[0_0_16px_rgba(59,156,165,0.7)] focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(59,156,165,0.9)] transition-all placeholder:text-zinc-400"
  // ... rest of props
/>
```

## Dependencies

- Google Fonts API (DotGothic16)
- Next.js font optimization
- Existing search functionality (no changes)

## Notes

- DotGothic16 is a pixel-style font inspired by 16×16 bitmap fonts from retro video games
- Font is free and open source (SIL Open Font License)
- Supports Latin characters with excellent readability
- Border brightness should be dramatic increase for visibility
- Laser effect removal will improve performance (eliminate animation)
- Chrome text removal will improve accessibility (eliminate transparent text)

## Questions for User

1. Border brightness level - should it glow strongly or just be more visible?
2. Font size adjustment - DotGothic16 may render differently than Inter, adjust sizing?
3. Sitewide font usage - did you want the replaced font (Inter bold) used in specific sections? If so, which ones?

## Testing Checklist

- [ ] Search autocomplete still triggers
- [ ] Search submission navigates correctly
- [ ] Results dropdown displays properly
- [ ] Mobile search UX unchanged
- [ ] Font loads on slow connections
- [ ] Border visible on light/dark backgrounds
- [ ] Placeholder text readable
- [ ] Focus states clearly visible
- [ ] No console errors or warnings
- [ ] Performance (no jank from font loading)

---

**Status**: Ready for implementation
**Next Step**: Import DotGothic16 font and configure CSS variables
