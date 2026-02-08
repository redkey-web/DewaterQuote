# Automated Quote System

**Created**: 2026-01-09
**Type**: Major Enhancement
**Status**: Planning
**Priority**: Critical (Pre-Launch)

## Summary

Transform the current "quote request" system into a fully automated "formal quote" system. Customers receive a complete, accurate quote (PDF + email) instantly on submission. 99% of quotes require zero manual intervention. Admin only contacts customers for exceptions.

## Current State vs Target

| Aspect | Current | Target |
|--------|---------|--------|
| Terminology | "Quote Request" | "Quote" |
| Customer PDF | Basic item list | Full pricing, delivery, terms |
| Delivery | Assumed free | Metro=free, Non-metro=TBC |
| Lead times | Not shown | Per-product lead times |
| Validity | Not stated | "Valid for 30 days" |
| Admin action | Review all | Exception-only |

## Scope

- **Impact**: High
- **Files**: ~15-20 estimated
- **Components**: Quote form, PDF generator, Email templates, API route, Database schema

---

## Phase 1: Customer PDF with Full Pricing ✅ COMPLETE

**Goal**: Make customer PDF look like a formal quote, not a request.

### 1.1 Update PDF Content
- [x] Add unit prices per line item
- [x] Add line totals (qty × price)
- [x] Add subtotal before discount
- [x] Show discount as line item with percentage
- [x] Add GST calculation (10%)
- [x] Add grand total (inc GST)
- [x] Add material certificate charges (if applicable)
- [x] Add delivery line placeholder

### 1.2 Add Quote Terms
- [x] Add validity period: "Valid for 30 days" with date
- [x] Add payment terms: "14 days from invoice"
- [x] Add full terms & conditions section

### 1.3 Update PDF Styling
- [x] Professional invoice-style layout
- [x] Company header with branding colors
- [x] Clear totals section with line above grand total
- [ ] Add company logo (optional - needs asset)

---

## Phase 2: Delivery Classification ✅ COMPLETE

**Goal**: Automatically determine delivery cost based on postcode.

### 2.1 Metro Postcode Classification
- [x] Create postcode lookup utility (`src/lib/postcode.ts`)
- [x] Define metro ranges for Perth, Sydney, Melbourne, Brisbane, Adelaide
- [x] Function: `isMetroPostcode()` and `classifyDelivery()`
- [x] Mine site keyword detection

### 2.2 Delivery Logic
- [x] Metro → "Free metro delivery"
- [x] Non-metro → "Delivery to be confirmed"
- [x] Remote/mine → "Remote/mine site - delivery quoted separately"

### 2.3 Display in Quote
- [x] Delivery note passed to PDF generator
- [x] Shows in PDF totals section
- [ ] Show in customer email body

---

## Phase 2.5: Quote Format Refinements (from Quote 2224)

**Reference**: Kris's Quote 2224 format

### 2.5.1 Expiry Date Logic
- [ ] Expiry = end of following month (not fixed 30 days)
- [ ] Function: `getQuoteExpiry(date: Date): Date`

### 2.5.2 Lead Times Per Product
- [ ] Add `leadTime` field to products database
- [ ] Show per-item: "Lead time: X weeks FRO - currently"
- [ ] Default: "2-3 weeks" if not specified

### 2.5.3 Christmas Shutdown Logic
- [ ] If date is Dec 5 - Jan 15: Add 2-3 weeks to lead times
- [ ] Flag in business email: "⚠️ Christmas period - extended lead times"
- [ ] Optional: Auto-add note about shutdown to customer quote

### 2.5.4 ABN and Company Details
- [x] ABN: 98622681663 (add to PDF footer)
- [x] Address: 67 Howe Street, Osborne Park, WA 6017

### 2.5.5 Price Display Format
- [ ] Show "Price: $X each Plus GST" prominently per item
- [ ] Current format shows unit price in column - may need enhancement

---

## Phase 3: Lead Times

**Goal**: Show estimated delivery times per product.

### 3.1 Database Update
- [ ] Add `leadTime` column to products table
- [ ] Default value: "2-3 weeks"
- [ ] Options: "In Stock", "1-2 weeks", "2-3 weeks", "3-4 weeks", "4-6 weeks"

### 3.2 Admin Management
- [ ] Add lead time field to product edit form
- [ ] Bulk update capability

### 3.3 Quote Display
- [ ] Show lead time per item in PDF
- [ ] Show overall lead time (longest item)
- [ ] Include in customer email

---

## Phase 4: Form Enhancements

**Goal**: Structured, unambiguous data capture.

### 4.1 Address Fields
- [ ] Add country field (default: Australia)
- [ ] Ensure all fields are required
- [ ] Add validation for Australian postcodes

### 4.2 Address Autocomplete (Optional - requires API)
- [ ] Integrate Google Places API
- [ ] Auto-fill street, suburb, state, postcode
- [ ] Fallback to manual entry

### 4.3 Product Display
- [ ] Bill-style line item layout (already exists)
- [ ] Show SKU prominently
- [ ] Show size clearly
- [ ] Clear quantity display

---

## Phase 5: Internal Notifications

**Goal**: Business email includes exception flags.

### 5.1 Exception Detection
- [ ] Non-metro delivery flag
- [ ] Large quantity flag (>10 total items)
- [ ] Unusual size detection (edge cases)
- [ ] Long lead time items (>4 weeks)

### 5.2 Business Email Updates
- [ ] Add "Flags" section at top of email
- [ ] Visual indicators (emoji or styled badges)
- [ ] Default expectation: "No action required"

### 5.3 Quick Action Links
- [ ] Already has approve link
- [ ] Add "Contact customer" template link
- [ ] Reference quote number in all communications

---

## Phase 6: Terminology & UX ✅ COMPLETE

**Goal**: Everything says "Quote" not "Quote Request".

### 6.1 Form Page
- [x] Submit button: "Submit Quote Request" → "Get Quote"
- [x] Updated disclaimer note

### 6.2 Emails
- [x] Subject: "Your Quote QR-XXXXX - Dewater Products"
- [x] Body: "Your Quote" not "Quote Request"
- [x] Formal, transactional tone

### 6.3 PDF
- [x] Title: "QUOTE" (not "QUOTE REQUEST")
- [x] Professional invoice-like layout

### 6.4 Success Page
- [x] "Quote Request Submitted" → "Quote Sent"
- [x] Updated message: "Your quote has been sent to your email"

### 6.5 Cart Sidebar
- [x] Header: "Quote Request" → "Your Quote"
- [x] Button: "Submit Quote Request" → "Get Quote"

---

## Phase 7: Validation & Polish

### 7.1 Form Validation
- [ ] All required fields enforced
- [ ] Phone number format validation
- [ ] Email format validation
- [ ] Postcode format validation (4 digits for AU)

### 7.2 Error Handling
- [ ] Clear error messages
- [ ] Field-level validation display
- [ ] Network error handling

### 7.3 Testing
- [ ] Test metro postcode flow
- [ ] Test non-metro postcode flow
- [ ] Test PDF generation with all scenarios
- [ ] Test email delivery
- [ ] Cross-browser testing

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| SendGrid API | ✅ Configured | Working |
| PDF Generator | ✅ pdfmake | Just installed |
| Google Places API | ❌ Optional | Requires billing setup |
| Postcode data | 📋 To create | Simple lookup |

## Database Changes

```sql
-- Add lead time to products
ALTER TABLE products ADD COLUMN lead_time TEXT DEFAULT '2-3 weeks';

-- (Future) Postcode classification table
CREATE TABLE postcode_zones (
  postcode TEXT PRIMARY KEY,
  zone TEXT NOT NULL, -- 'metro' | 'regional' | 'remote'
  state TEXT NOT NULL
);
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/request-quote/page.tsx` | Form fields, validation, terminology |
| `src/app/api/quote/route.ts` | Delivery logic, exception flags |
| `src/lib/generate-quote-pdf.ts` | Full pricing, terms, styling |
| `src/lib/postcode.ts` | NEW: Postcode classification |
| `src/db/schema.ts` | Add leadTime to products |
| `src/components/QuoteCart.tsx` | Terminology updates |

## Success Criteria

1. ✅ Customer receives formal quote PDF with full pricing
2. ✅ Delivery status auto-determined (metro vs TBC)
3. ✅ Lead times shown per product
4. ✅ Quote valid for 30 days clearly stated
5. ✅ Admin only intervenes for flagged exceptions
6. ✅ No "request" language anywhere
7. ✅ 99% of quotes need zero manual work

---

## Implementation Order

**Start immediately (today):**
1. Phase 1: Full pricing in PDF
2. Phase 2: Delivery classification
3. Phase 6: Terminology changes

**Next session:**
4. Phase 3: Lead times
5. Phase 5: Internal flags

**Later/Optional:**
6. Phase 4: Address autocomplete
7. Phase 7: Polish

---

Last Updated: 2026-01-09
