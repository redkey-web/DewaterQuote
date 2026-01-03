# DewaterQuote Site Improvements - January 2025

**Created**: 2025-01-04
**Type**: Enhancement / Multi-phase improvement
**Status**: Planning

## Summary

Comprehensive site improvements covering UI polish, navigation fixes, admin panel enhancements, shopping cart improvements, quote form overhaul, and geo-restricted pricing. This plan consolidates multiple requirements into logical phases for efficient execution.

## Scope
- **Impact**: High
- **Files**: ~30+ files estimated
- **Components**: Header, ProductCard, QuoteCart, request-quote page, Admin pages, globals.css

---

## Phase 1: Navigation & Route Verification ✅
**Priority: CRITICAL - Must complete first** - COMPLETE

### Tasks
- [x] 1.1 Verify all menu routes exist and load correctly
  - `/resources` - Removed from menu ✅
  - `/expansion-joints` - Full page with subcategories ✅
  - All subcategory routes load ✅
- [x] 1.2 Create separate category pages
  - [x] `/expansion-joints` category page exists with products
  - [x] `/strainers` works for all strainer types
  - [x] `/defender-strainers` handled by dynamic brand route
- [x] 1.3 Header navigation verified
  - Expansion Joints in menu with all subcategory links ✅
  - Brand pages under Brands section ✅

**Verified**: 2025-01-04

---

## Phase 2: UI Polish - Remove Glows & Add Glassmorphism ✅
**Priority: High** - COMPLETE

### Tasks
- [x] 2.1 Cyan glow effects - VERIFIED
  - No cyan glow effects found in globals.css (shadows are all black/gray)
  - `.hover-elevate` only has subtle shadow lift, no glow
  - Button hover states use lighter teal background, not glow
- [x] 2.2 Glassmorphism already implemented:
  - `.glass`, `.glass-subtle`, `.glass-button` classes exist in globals.css
  - Header dropdowns (products, industries, more) use `glass` class
  - Quote cart panel uses `glass` class
- [x] 2.3 Search dropdown cleaned up:
  - Removed `glass` blur from desktop search results dropdown
  - Removed `glass` blur from desktop "no results" dropdown
  - Removed `glass` blur from mobile search results dropdown
  - Now using clean `bg-popover border border-border` styling

**Completed**: 2025-01-04

---

## Phase 3: Image & Video Import from Neto
**Priority: High**

### Tasks
- [ ] 3.1 Audit existing images in `.planning/audit/images/`
  - Map Neto SKUs to current DB products
  - Identify missing images
- [ ] 3.2 Create image import script
  - Read from `.planning/audit/images/` folders
  - Upload to Vercel Blob
  - Update product_images table
- [ ] 3.3 Check for videos in Neto export
  - Extract YouTube IDs from CSV
  - Update product `video` field in DB
- [ ] 3.4 Remove AI-generated placeholder images
  - Scan for products using placeholder images
  - Replace with real product images

**Files:**
- `scripts/import-neto-images.ts` (new)
- Database updates to `product_images` table

---

## Phase 4: Geo-Restrict Prices to Australia
**Priority: High - Security/Business**

### Tasks
- [ ] 4.1 Create geo-detection middleware
  - Use Vercel Edge functions with geolocation
  - Detect country from request headers
- [ ] 4.2 Update price display logic
  - Hide prices for non-AU visitors
  - Show "Contact for pricing" message
- [ ] 4.3 Components to update:
  - ProductCard.tsx - hide price/discount badges
  - ProductDetailClient.tsx - hide pricing table
  - QuoteCart.tsx - hide totals
  - request-quote/page.tsx - hide pricing summary

**Files:**
- `middleware.ts` (new or update)
- `src/lib/geo.ts` (new utility)
- `src/components/ProductCard.tsx`
- `src/components/ProductDetailClient.tsx`
- `src/components/QuoteCart.tsx`
- `src/app/request-quote/page.tsx`

---

## Phase 5: Admin Panel Improvements
**Priority: Medium**

### Tasks
- [ ] 5.1 Add sortable columns to all tables
  - Products table: sort by name, price, brand, category
  - Inventory table: sort by quantity, SKU
  - Use existing shadcn DataTable or add sorting
- [ ] 5.2 Reorder columns for priority info first
  - Products: Image, Name, SKU, Price, Qty, Brand, Category, Actions
  - Reduce horizontal scroll need
- [ ] 5.3 Add image alt tag editing
  - Update product edit form to include alt text fields
  - Save to product_images table
- [ ] 5.4 Add URL override capability
  - Add `slug_override` field to products
  - Show warning when slug is manually set
- [ ] 5.5 Add automatic 301 redirect option
  - Create redirects table in DB
  - Add checkbox "Create redirect from old URL"
  - Implement redirect middleware

**Files:**
- `src/app/admin/products/page.tsx`
- `src/app/admin/inventory/page.tsx`
- `src/app/admin/products/[id]/page.tsx`
- `src/lib/db/schema.ts` (add redirects table)
- `middleware.ts`

---

## Phase 6: Shopping Cart Improvements ✅
**Priority: High** - VERIFIED

### Tasks
- [x] 6.1 Ensure brand and size shown for ALL products
  - Verified: Code already displays `{item.brand}{sizeLabel ? ` • ${sizeLabel}` : ""}`
  - Products WITH size options → shows "Brand • Size"
  - Products WITHOUT size options (POA) → shows "Brand" only (correct - no size to show)
  - `Product.brand` is required field, always passed through `productToQuoteItem()`
- [x] 6.2 Cart display verified
  - QuoteCart.tsx lines 141, 331: Shows brand + size correctly
  - request-quote/page.tsx line 342: Shows brand + size correctly

**Verified**: 2025-01-04

---

## Phase 7: Category Pages - Button Change ✅
**Priority: Medium** - COMPLETE

### Tasks
- [x] 7.1 Change ProductCard button from "Add to Quote" to "View Product"
  - Changed ALL buttons to "View Product" with ArrowRight icon
  - Removed conditional logic for priceVaries
- [x] 7.2 Update button behavior
  - Now uses Link component to navigate to product detail page
  - Removed toast about size selection
  - Removed unused imports (router, toast, useQuote, productToQuoteItem)

**Files:**
- `src/components/ProductCard.tsx`

---

## Phase 8: Click-to-Call Phone Numbers
**Priority: Low**

### Tasks
- [ ] 8.1 Audit all phone number occurrences
  - Header.tsx (already tel: link)
  - Footer.tsx
  - Contact page
  - request-quote page
  - Meet the Team page
- [ ] 8.2 Standardize to "Free Call" with 1300 number
  - Use consistent `<a href="tel:1300271290">Free Call 1300 271 290</a>`

**Files:**
- Multiple pages containing phone numbers
- Create reusable PhoneLink component

---

## Phase 9: Quote Form Overhaul
**Priority: High - Major feature update**

### Tasks
- [x] 9.1 UI Changes ✅
  - [x] Changed "Quote Items" to "Your Items" header
  - [x] Added total item count: "X items (Y unique)"
  - [x] Added intro disclaimer box at top of form
  - [x] Disclaimer: "This quote request is not a legally binding agreement until approved by a director at Dewater Products"

- [x] 9.2 Material Certificates as Line Items ✅
  - [x] Enhanced badge to show "+ Material Cert ($350)" on each product
  - [x] Kept summary section showing total cert count and fee
  - Note: Shows both inline and in summary for clarity

- [x] 9.3 Add Delivery Note ✅
  - [x] Added: "Free delivery for metro areas. If there are any shipping costs for regional locations, we will confirm on final quote."

- [x] 9.4 Add Warranty Info ✅
  - [x] Added: "Up to 5 years on Orbit/Straub couplings* | 12 months on all other products"

- [ ] 9.5 Admin Quote Handling (Deferred)
  - [ ] Add "Forward to client" option with shipping cost field
  - [ ] Email to Kris as editable/forwardable format
  - [ ] Generate PDF version of quote

**Completed (9.1-9.4)**: 2025-01-04

**Files:**
- `src/app/request-quote/page.tsx`
- `src/app/api/quote/route.ts`
- `src/lib/pdf.ts` (new - PDF generation)
- Email template updates

---

## Dependencies

### External Services
- Vercel Edge for geo-detection
- PDF generation library (e.g., @react-pdf/renderer or jspdf)

### Existing Components
- ProductCard, QuoteCart, ProductDetailClient
- Admin layout and forms

---

## Consolidated Task Groups (For Efficiency)

### Group A: CSS/Styling (Phases 2, 8)
All visual changes can be done together:
- Remove glows
- Add glassmorphism
- Style phone links

### Group B: Cart/Quote System (Phases 6, 7, 9)
Related to quote flow:
- Cart brand/size display
- Button changes
- Quote form overhaul

### Group C: Navigation/Routes (Phase 1)
All route work:
- Create missing pages
- Update Header

### Group D: Admin Panel (Phase 5)
All admin improvements

### Group E: Data/Images (Phases 3, 4)
Backend and data:
- Image import
- Geo-restriction

---

## Implementation Order

1. **Phase 1** - Navigation (blocks everything else)
2. **Phase 6** - Cart fixes (quick win, high visibility)
3. **Phase 7** - Button changes (quick win)
4. **Phase 2** - UI polish
5. **Phase 9** - Quote form overhaul (complex, save for focused session)
6. **Phase 8** - Phone links (quick)
7. **Phase 5** - Admin improvements
8. **Phase 3** - Image import
9. **Phase 4** - Geo-restriction (requires testing)

---

## Notes

### Current Navigation Issues Found
- `/resources` is in the "More" menu but page doesn't exist
- Need to verify `/defender-strainers` brand page exists
- Expansion joints are under `/bore-flex` but user wants separate category page

### Image Audit Available
- `.planning/audit/images/` contains 100+ product images from Neto
- SKU-based folder structure maps to products
- Need to upload to Vercel Blob and link to DB

### Quote Form Current State
- Uses "Quote Items" heading
- Certificates shown in summary section under discounts
- No PDF generation
- No admin forwarding functionality

### Geo-Restriction Approach
- Use Vercel's `request.geo.country` in middleware
- Create context provider for geo state
- Pass to components that need to hide prices
