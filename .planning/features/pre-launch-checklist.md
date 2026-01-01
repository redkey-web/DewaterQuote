# Pre-Launch Feature Checklist

**Created**: 2026-01-01
**Type**: feature-plan
**Status**: Planning
**Priority**: High

## Summary

Comprehensive list of missing features and fixes required before the Dewater Products website can go live. Organized into phases by priority and dependency.

---

## Phase 1: Core Functionality (High Priority)

Critical features that affect user experience and site usability.

### 1.1 Search Bar Functionality
- [ ] Create search API endpoint (`/api/search`)
- [ ] Implement product search with fuzzy matching
- [ ] Connect header search input to search
- [ ] Connect hero search input to search
- [ ] Add search results page (`/search?q=`)
- [ ] Add keyboard shortcuts (Cmd+K)
- [ ] Mobile search functionality

**Files**: `src/components/Header.tsx`, `src/app/page.tsx`, `src/app/search/page.tsx`, `src/app/api/search/route.ts`

### 1.2 Breadcrumb Navigation System
- [ ] Create Breadcrumb component
- [ ] Add to category pages
- [ ] Add to subcategory pages
- [ ] Add to product detail pages
- [ ] Add to brand pages
- [ ] Ensure JSON-LD structured data included

**Files**: `src/components/Breadcrumb.tsx`, all category/product pages

### 1.3 Datasheets Download System
- [ ] Display downloads on product detail page
- [ ] Add "Download Datasheet" button to specs section
- [ ] Create download tracking (optional)
- [ ] Ensure PDFs open in new tab

**Files**: `src/components/ProductDetailClient.tsx`, `src/data/products.ts`

---

## Phase 2: Content Pages (High Priority)

Essential pages linked from navigation that currently 404.

### 2.1 About Page (`/about`)
- [ ] Create page with company info
- [ ] Add team/history section
- [ ] Include certifications and partnerships
- [ ] Add brand logos (Straub, Orbit, Teekay)

**File**: `src/app/about/page.tsx`

### 2.2 Resources Page (`/resources`)
- [ ] Create page structure
- [ ] Add datasheet downloads section
- [ ] Add technical guides section
- [ ] Add installation videos section
- [ ] Link to brand resources

**File**: `src/app/resources/page.tsx`

### 2.3 Datasheet Scraping from Old Site
- [ ] Identify old site URL structure
- [ ] Create scraping script
- [ ] Download all PDF datasheets
- [ ] Upload to Vercel Blob
- [ ] Link to products in database

**Files**: `scripts/scrape-datasheets.ts`

---

## Phase 3: Navigation & Admin Improvements

Improve site navigation and admin workflow.

### 3.1 Category Side Panel
- [ ] Create CategorySidebar component
- [ ] Add to category listing pages
- [ ] Add to product detail pages
- [ ] Show subcategories with counts
- [ ] Mobile-responsive (collapsible)

**Files**: `src/components/CategorySidebar.tsx`, category pages

### 3.2 Manage Button in Inventory Admin
- [ ] Add "Edit" button/link to inventory table
- [ ] Link to `/admin/products/[id]`
- [ ] Add quick actions dropdown

**File**: `src/components/admin/InventoryManagementTable.tsx`

---

## Phase 4: Brand & Product Enhancements

### 4.1 Defender Strainers Brand
- [ ] Add Defender Strainers to brands table
- [ ] Create brand logo and upload
- [ ] Create brand page (`/defender-strainers` or `/brands/defender-strainers`)
- [ ] Add logo to relevant strainer product pages
- [ ] Update navigation if needed

**Files**: Database seed, `src/app/brands/[brand]/page.tsx`, product pages

### 4.2 Download Price List PDF
- [ ] Create or obtain price list PDF
- [ ] Upload to Vercel Blob
- [ ] Wire up "Download Price List" button on contact page
- [ ] Add to Resources page

**File**: `src/app/contact/page.tsx`, `src/app/resources/page.tsx`

---

## Phase 5: Policy & Information Pages

Lower priority pages required for a complete professional site.

### 5.1 FAQ Page (`/faq`)
- [ ] Create page with accordion FAQ component
- [ ] Add common questions about products
- [ ] Add ordering/shipping questions
- [ ] Add JSON-LD FAQPage schema

**File**: `src/app/faq/page.tsx`

### 5.2 Shipping & Delivery (`/shipping-delivery`)
- [ ] Create page with shipping info
- [ ] Add delivery zones and timeframes
- [ ] Add freight cost information

**File**: `src/app/shipping-delivery/page.tsx`

### 5.3 Returns & Refunds (`/returns-refunds`)
- [ ] Create page with return policy
- [ ] Add RMA process
- [ ] Add refund conditions

**File**: `src/app/returns-refunds/page.tsx`

### 5.4 Payment Methods (`/payment-methods`)
- [ ] Create page with accepted payments
- [ ] Add trade account info
- [ ] Add invoice terms

**File**: `src/app/payment-methods/page.tsx`

### 5.5 Warranty Information (`/warranty`)
- [ ] Create page with warranty terms
- [ ] Add brand-specific warranties
- [ ] Add claim process

**File**: `src/app/warranty/page.tsx`

### 5.6 Terms & Conditions (`/terms-conditions`)
- [ ] Create page with T&Cs
- [ ] Add ordering terms
- [ ] Add liability disclaimers

**File**: `src/app/terms-conditions/page.tsx`

### 5.7 Privacy Policy (`/privacy-policy`)
- [ ] Create page with privacy policy
- [ ] Add data collection info
- [ ] Add cookie policy
- [ ] GDPR/Australian Privacy Act compliance

**File**: `src/app/privacy-policy/page.tsx`

---

## Phase 6: Optional Enhancements

Nice-to-have features that can be added post-launch.

### 6.1 Industries Landing Page (`/industries`)
- [ ] Create landing page listing all industries
- [ ] Add industry cards with images
- [ ] Link to individual industry pages

**File**: `src/app/industries/page.tsx`

---

## Priority Matrix

| Phase | Priority | Est. Effort | Impact |
|-------|----------|-------------|--------|
| Phase 1 | **Critical** | Medium | High - Core UX |
| Phase 2 | **High** | Medium | High - Missing content |
| Phase 3 | **Medium** | Low-Medium | Medium - Navigation |
| Phase 4 | **Medium** | Low | Medium - Completeness |
| Phase 5 | **Low-Medium** | Low | Low - Policy pages |
| Phase 6 | **Low** | Low | Low - Optional |

---

## Dependencies

```
Phase 1 (Search, Breadcrumbs, Datasheets)
    ↓
Phase 2 (About, Resources, Scraping)
    ↓
Phase 3 (Sidebar, Admin) ←── Can run parallel with Phase 2
    ↓
Phase 4 (Defender Brand, Price List)
    ↓
Phase 5 (Policy Pages) ←── Can run parallel with Phase 4
    ↓
Phase 6 (Optional)
```

---

## Quick Wins (Can do immediately)

These can be completed quickly with minimal effort:

1. **Manage Button in Inventory** - Add link to existing table (~15 min)
2. **Datasheet Display** - Wire up existing downloads data (~30 min)
3. **Breadcrumb Component** - Create reusable component (~1 hr)

---

## Blockers & Questions

- [ ] **Old site URL**: Need URL to scrape datasheets from
- [ ] **Defender Strainers logo**: Need logo file
- [ ] **Policy content**: Need actual policy text (or generate drafts)
- [ ] **Price list PDF**: Need current price list file

---

## Related Documents

- [[site-audit.md]] - Full site audit with Playwright results
- [[product-price-audit.md]] - Data integrity audit
- [[migration-plan.md]] - Original migration plan

---

Last Updated: 2026-01-01
