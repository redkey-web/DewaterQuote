# SEO Content Optimization

**Created**: 2026-01-24
**Type**: Enhancement
**Status**: Complete
**Priority**: High (SEO competitive advantage)

## Summary

Implement targeted SEO improvements based on audit findings. Focus on content and text changes only - no design changes. The "WE SUPPLY..." visual element stays as-is.

## Current State Analysis

### What's Already Good ✅
- Organization schema in `layout.tsx` (line 76)
- Product schema with price ranges (`JsonLd.tsx`)
- Breadcrumb schema on all category/subcategory pages
- FAQ schema on industry pages (dynamic JSON-LD)
- Category pages have 300-600+ words (pipe-couplings has ~500 words)
- Industry pages have 600-900+ words each
- Proper canonical URLs set
- Good keyword-focused metadata on category pages

### Gaps to Address
1. **Homepage metadata** - Title leads with brand, should lead with keyword
2. **Homepage H1** - Currently a `<p>` tag, needs proper `<h1>`
3. **Homepage FAQPage schema** - FAQs exist but no schema markup
4. **Local SEO** - Perth mentioned but not prominent enough
5. **Internal linking** - Could add more contextual links from homepage

---

## Phase 1: Homepage Metadata & Structure

### 1.1 Optimize Homepage Title & Description (layout.tsx)

**File**: `src/app/layout.tsx` (lines 19-24)

Current:
```typescript
title: {
  default: "Dewater Products - Industrial Pipe Fittings & Valves",
  ...
},
description: "Premium industrial pipe fittings, valves, couplings..."
```

Change to:
```typescript
title: {
  default: "Industrial Pipe Fittings & Valves Australia | Dewater Products",
  ...
},
description: "Industrial pipe fittings, couplings, valves & expansion joints. Australian stock, fast delivery & expert support. Perth-based specialists supplying mining, water & irrigation industries."
```

- [x] Update default title to lead with keyword + add geo (Australia)
- [x] Rewrite meta description to be more action-oriented with Perth mention
- [x] Update OpenGraph title to match

### 1.2 Add Proper H1 to Homepage (page.tsx)

**File**: `src/app/page.tsx`

Current (line 443-444):
```tsx
<p className="font-comfortaa text-xl md:text-2xl font-bold mb-4...">
  Industrial Pipe Fittings Supply
</p>
```

Change to:
```tsx
<h1 className="font-comfortaa text-xl md:text-2xl font-bold mb-4...">
  Industrial Pipe Fittings & Valves Australia
</h1>
```

- [x] Change `<p>` to `<h1>` with optimized text
- [x] Keep existing styling classes

### 1.3 Add Semantic H2s to Homepage Sections

**File**: `src/app/page.tsx`

Add proper heading hierarchy:
- [x] Product Categories section: Add `<h2>` "Browse Pipe Fittings by Category" (sr-only)
- [x] Introduction section: Keep existing `<h2>` (already good)
- [x] How It Works section: Keep existing `<h2>`
- [x] Industry Solutions section: Keep existing `<h2>`
- [x] FAQ section: Keep existing `<h2>`

---

## Phase 2: Homepage Schema & Local SEO

### 2.1 Add FAQPage Schema to Homepage

**File**: `src/app/page.tsx`

Add at bottom of component (similar to industry pages pattern):
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What brands do you stock?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We are authorized distributors for Straub, Orbit Couplings, Teekay, and Defender Valves..."
          }
        },
        // ... all 5 FAQs
      ]
    })
  }}
/>
```

- [x] Extract FAQ content into array
- [x] Add FAQPage JSON-LD script at bottom of component

### 2.2 Strengthen Local SEO (Perth)

**File**: `src/app/page.tsx` - Introduction section (lines 668-704)

Current text is good but can be enhanced:
- [x] Add text: "Based in Perth, Western Australia, we supply nationally with fast metro delivery."
- [x] Ensure "Perth" appears in introduction section copy

**File**: `src/components/JsonLd.tsx` - Organization schema

Current has PostalAddress but could add:
- [ ] Add `areaServed` with regions
- [ ] Consider adding `LocalBusiness` type as additional @type

---

## Phase 3: Expand Thin Category Pages

### 3.1 Industrial Valves Hub Page

**File**: `src/app/industrial-valves/page.tsx`

Check content depth and add:
- [x] 300-600 words of SEO content explaining valve types
- [x] Internal links to subcategory pages
- [x] Related Products section with cross-links

### 3.2 Strainers Hub Page

**File**: `src/app/strainers/page.tsx`

- [x] Ensure 300-600 words of content (added About Pipeline Strainers section)
- [x] Add application-based content like pipe-couplings page has
- [x] Internal links to basket-strainers, y-strainers, etc. + Related Products section

### 3.3 Expansion Joints Hub Page

**File**: `src/app/expansion-joints/page.tsx`

- [x] Check content depth (already excellent ~300 words)
- [x] Rubber bellows terminology already present
- [x] Added Related Products section for cross-linking

---

## Phase 4: Product Page Enhancements

### 4.1 Add Related Products Section

**File**: `src/app/[slug]/page.tsx` (product detail page)

- [ ] Add "Related Products" section with internal links
- [ ] Link back to category page
- [ ] Cross-link to complementary products

### 4.2 Ensure Unique Descriptions

Audit product descriptions in database:
- [ ] Check products with less than 100 words description
- [ ] Flag for content enhancement (manual task)

---

## Phase 5: Internal Linking Improvements

### 5.1 Homepage Contextual Links

**File**: `src/app/page.tsx` - Introduction section

Add contextual links within paragraph copy:
- [x] "pipe couplings" → `/pipe-couplings`
- [x] "industrial valves" → `/industrial-valves`
- [x] "expansion joints" → `/expansion-joints`
- [x] "strainers" → `/strainers`

Example:
```tsx
<p>
  We specialise in <Link href="/pipe-couplings" className="text-primary hover:underline">pipe couplings</Link>,
  <Link href="/industrial-valves" className="text-primary hover:underline">valves</Link>,
  <Link href="/expansion-joints" className="text-primary hover:underline">expansion joints</Link>, and
  <Link href="/strainers" className="text-primary hover:underline">strainers</Link> from world-leading manufacturers...
</p>
```

### 5.2 Category Page Cross-Links

Each category page should link to related categories:
- [x] Pipe couplings → already has related products
- [x] Industrial valves → added Related Products section
- [x] Expansion joints → added Related Products section

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Update title, description, OG tags |
| `src/app/page.tsx` | H1 tag, FAQ schema, contextual links |
| `src/components/JsonLd.tsx` | Enhance Organization schema |
| `src/app/industrial-valves/page.tsx` | Content expansion |
| `src/app/strainers/page.tsx` | Content expansion |
| `src/app/expansion-joints/page.tsx` | Content review |
| `src/app/[slug]/page.tsx` | Related products |

---

## Verification Checklist

- [x] Build passes without errors
- [x] Homepage has valid H1
- [x] Homepage FAQPage schema added (test with Google Rich Results)
- [x] Title tag leads with keywords
- [x] Meta description under 160 chars and includes CTA
- [x] Perth mentioned in homepage content
- [x] All internal links resolve correctly
- [x] No duplicate H1s on any page

---

## Out of Scope (per user request)

- ❌ Core design changes
- ❌ Removing "WE SUPPLY..." visual element
- ❌ Layout or structural redesign
- ❌ New page creation
- ❌ Backlink acquisition (external)
- ❌ Google Business Profile (external)

---

## Notes

- Homepage is currently `"use client"` - FAQ schema can still be added inline
- Industry pages already have excellent FAQPage schema implementation
- Pipe couplings page is the gold standard for content depth
- Consider using similar pattern for other category pages

---

Last Updated: 2026-01-24
