# Pre-Launch Feature Checklist

**Created**: 2026-01-01
**Updated**: 2026-01-04
**Type**: feature-plan
**Status**: Active
**Priority**: High

## Summary

Comprehensive list of features for the Dewater Products website. Many items have been completed. Remaining work focused on FAQ accordions and optional enhancements.

---

## Phase 1: Core Functionality ✅ COMPLETE

### 1.1 Search Bar Functionality ✅
- [x] Create search API endpoint (`/api/search`)
- [x] Implement product search with fuzzy matching
- [x] Connect header search input to search
- [x] Connect hero search input to search
- [x] Add search results page (`/products?search=`)
- [x] Mobile search functionality
- [~] Keyboard shortcuts (Cmd+K) - NOT NEEDED

### 1.2 Breadcrumb Navigation System ✅
- [x] Create Breadcrumb component (`ui/breadcrumb.tsx`)
- [x] Add to category pages
- [x] Add to subcategory pages
- [x] Add to product detail pages
- [x] Add to brand pages
- [x] JSON-LD structured data included

### 1.3 Datasheets Download System ✅
- [x] Display downloads on product detail page
- [x] "Download Datasheet" button in product info section
- [x] PDFs open in new tab

---

## Phase 2: Content Pages ✅ MOSTLY COMPLETE

### 2.1 About Page ✅
- [x] Created `/about/page.tsx`
- [x] Company info and history
- [x] Industries served section
- [x] Contact links

### 2.2 Meet the Team ✅
- [x] Created `/meet-the-team/page.tsx`

### 2.3 Resources Page
- [~] NOT NEEDED - datasheets available on product pages

---

## Phase 3: Navigation & Admin ✅ COMPLETE

### 3.1 Category Sidebar
- [~] NOT NEEDED for now - navigation works well via header menu

### 3.2 Manage Button in Inventory Admin ✅
- [x] Edit functionality exists in inventory table
- [x] Links to `/admin/products/[id]`

---

## Phase 4: Brand & Product ✅ COMPLETE

### 4.1 Defender Strainers Brand ✅
- [x] Added to brands table
- [x] Brand page exists (`/brands/defender-strainers`)
- [x] In header navigation
- [x] In footer links

### 4.2 Download Price List PDF
- [~] NOT NEEDED - removed per client request

---

## Phase 5: Policy & Information Pages ✅ COMPLETE

### 5.1 FAQ Accordions
- [ ] Add FAQ section to homepage (bottom)
- [ ] Add FAQ section to category pages
- [ ] Add FAQ section to subcategory pages

**Note**: No standalone FAQ page - FAQs should be contextual on each page.

### 5.2 Shipping & Delivery ✅
- [x] `/delivery/page.tsx` exists with full content

### 5.3 Returns & Refunds ✅
- [x] `/returns/page.tsx` exists with full content

### 5.4 Payment Methods
- [~] NOT NEEDED per client request

### 5.5 Warranty Information ✅
- [x] Created `/warranty/page.tsx` with 12-month warranty terms
- [x] Content sourced from old site buying guides
- [x] Added to footer navigation

### 5.6 Terms of Use ✅
- [x] Created `/terms/page.tsx`
- [x] Content sourced from old site
- [x] Added to footer navigation

### 5.7 Privacy Policy ✅
- [x] `/privacy/page.tsx` exists
- [x] Updated with security policy info (consolidated)
- [x] Data security section expanded with encryption details

---

## Phase 6: Optional Enhancements

### 6.1 Industries Landing Page
- [ ] Create landing page listing all industries (`/industries/page.tsx`)
- [ ] Add industry cards with images
- [ ] Link to individual industry pages

**Priority**: Low - individual industry pages work fine from nav menu

---

## Remaining Work Summary

| Item | Priority | Effort |
|------|----------|--------|
| FAQ accordions on pages | Medium | 2-3 hrs |
| Industries landing page | Low | 1 hr |

---

## Completed in This Session (2026-01-04)

1. ✅ Fixed hero search bar functionality (was just a static input)
2. ✅ Created `/warranty/page.tsx` with content from old site
3. ✅ Created `/terms/page.tsx` with content from old site
4. ✅ Updated `/privacy/page.tsx` with security policy info
5. ✅ Updated Footer with Warranty and Terms links
6. ✅ Verified 17 pages have breadcrumbs
7. ✅ Verified search API and header search working
8. ✅ Verified datasheets download button on product pages

---

## Old Site Pages Migrated

From the old site footer "Information" section:
- Terms of Use → `/terms` ✅
- Privacy Policy → `/privacy` ✅ (already existed, enhanced)
- Delivery Policy → `/delivery` ✅ (already existed)
- Returns Policy → `/returns` ✅ (already existed)
- Security Policy → Consolidated into `/privacy` ✅

---

Last Updated: 2026-01-04
