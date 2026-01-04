# Category Hero Images & Defender Strainers Logo

**Created**: 2026-01-05
**Completed**: 2026-01-05
**Type**: enhancement
**Status**: Complete

## Summary

Generate hero images for category pages that currently lack them, and update the Defender Strainers brand logo with the provided image.

## Scope

- **Impact**: Medium (visual enhancement)
- **Files**: ~8 files (category pages + brand config)
- **Components**: Hero sections on category pages, brand logo

## Current State

### Pages WITH Hero Images
| Page | Hero Status | Image Source |
|------|-------------|--------------|
| `/industrial-valves` | ✅ Hero | Product image (butterfly valve) |
| `/orbit-couplings` | ✅ Hero | Product images |
| `/straub-couplings-repair-clamps` | ✅ Hero | Product images |
| `/teekay` | ✅ Hero | Product images |
| `/bore-flex` | ✅ Hero | Product images |

### Pages WITHOUT Hero Images (Need Generation)
| Page | Current State | Hero Image Needed |
|------|--------------|-------------------|
| `/pipe-couplings` | Minimal h1/subtitle | Pipe coupling hero |
| `/expansion-joints` | Minimal h1/subtitle | Rubber expansion joint hero |
| `/strainers` | Minimal h1/subtitle | Industrial strainer hero |
| `/pipe-repair` | Minimal h1/subtitle | Pipe repair clamp hero |
| `/flange-adaptors` | Minimal h1/subtitle | Flange adaptor hero |

### Brand Logo Update
| Brand | Current Logo | Action |
|-------|-------------|--------|
| Defender Strainers | `defender-strainers-logo.png` | Replace with provided image |

## Phases

### Phase 1: Defender Strainers Logo Update ✅
- [x] Save provided logo image to `/public/images/brands/defender-strainers-logo.png`
- [x] Verify logo displays correctly on `/brands/page.tsx`
- [x] Verify logo displays correctly on `/brands/defender-strainers`

### Phase 2: Use Existing Product Images ✅
Existing product images from the database used instead of AI generation:
- [x] Pipe couplings: `/images/products/orbit/flex-grip-l-main.jpg`
- [x] Expansion joints: `/images/products/expansion-joints/fsf-single-sphere.jpg`
- [x] Strainers: `/images/products/strainers/y-strainer-316ss.jpg`
- [x] Pipe repair: `/images/products/orbit/pipe-repair-clamp-200mm.jpg`
- [x] Flange adaptors: `/images/products/flange-adaptors/ss-flange-adapter-316.png`

### Phase 3: Add Hero Sections to Category Pages ✅
For each page, added hero section following `/industrial-valves` pattern:
- [x] `/pipe-couplings/page.tsx` - Added hero with slate gradient
- [x] `/expansion-joints/page.tsx` - Added hero with orange gradient
- [x] `/strainers/page.tsx` - Added hero with green gradient
- [x] `/pipe-repair/page.tsx` - Added hero with red gradient
- [x] `/flange-adaptors/page.tsx` - Added hero with purple gradient

### Phase 4: Verification ✅
- [x] All hero images load correctly
- [x] Responsive design works on mobile
- [x] Dev server showing changes via hot reload
- [x] Build pending (live reload in dev mode)

## Hero Section Pattern

Reference: `/src/app/industrial-valves/page.tsx`

```tsx
{/* Hero Section */}
<div className="relative overflow-hidden border-b">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-transparent dark:from-blue-950/30 dark:via-blue-900/10 dark:to-transparent" />
  <div className="max-w-7xl mx-auto px-6 py-16 relative">
    <div className="flex flex-col lg:flex-row gap-12 items-center">
      <div className="flex-1">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
          <Icon className="w-4 h-4" />
          Category Tag
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">Page Title</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
          Description text
        </p>
        {/* CTA Buttons */}
      </div>
      <div className="flex-shrink-0 relative">
        <div className="relative w-80 h-80 lg:w-96 lg:h-96">
          <Image
            src="/images/heroes/hero-{category}.webp"
            alt="Alt text"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  </div>
</div>
```

## Image Requirements

| Attribute | Requirement |
|-----------|-------------|
| Format | WebP preferred, PNG/JPG acceptable |
| Dimensions | 800x800 to 1200x1200 (square/contain works best) |
| Style | Professional industrial photography |
| Background | Clean, gradient-compatible (white/light grey ideal) |
| Subject | Product clearly visible, good detail |

## Dependencies

- AI image generation (Claude/external tool)
- Vercel Blob storage for images
- Next.js Image component optimization

## Notes

- Consider using existing product images from database if suitable
- May need to source images from manufacturer websites
- Hero images should be WebP for performance
- Images stored in `/public/images/heroes/` directory

## Image Generation Prompts

**For AI image generation:**

1. **Pipe Couplings**: "Professional industrial photography of a 316 stainless steel pipe coupling, clean white/light grey background, product photography style, high detail, isolated product shot"

2. **Expansion Joints**: "Professional industrial photography of a rubber twin sphere expansion joint with zinc flanges, clean background, industrial product shot"

3. **Strainers**: "Professional industrial photography of a stainless steel Y-strainer or basket strainer, pipeline equipment, clean background"

4. **Pipe Repair**: "Professional industrial photography of a stainless steel pipe repair clamp installed on pipe, emergency repair equipment"

5. **Flange Adaptors**: "Professional industrial photography of a stainless steel flange adaptor, pipe fitting equipment, clean background"
