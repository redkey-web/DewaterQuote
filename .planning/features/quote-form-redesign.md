# Quote Form Redesign

**Created**: 2025-12-28
**Type**: Enhancement
**Status**: Complete

## Summary

Complete redesign of the quote request form to match B2B industrial expectations. Adds structured address fields, billing address toggle, and invoice-style quote summary with line items, editable quantities, discounts, and totals.

## Scope
- **Impact**: High
- **Files**: 2 modified (request-quote/page.tsx, api/quote/route.ts)
- **Components**: RequestQuotePage (redesigned inline)

## Implementation Notes

- Google Places autocomplete deferred (form works with browser autofill)
- Invoice-style table built inline in page (no separate component needed)
- All phases combined into single implementation

---

## Phases

### Phase 1: Schema & API Updates ✅
- [x] Update Zod schema with new fields:
  - `companyName` (required)
  - `contactName` (required)
  - `email` (required)
  - `phone` (required)
  - `deliveryAddress.street` (required)
  - `deliveryAddress.suburb` (required)
  - `deliveryAddress.postcode` (required)
  - `deliveryAddress.state` (required)
  - `billingAddress` (optional, same structure)
  - `billingSameAsDelivery` (boolean, default true)
  - `notes` (optional)
- [x] Update API route to handle new structure
- [x] Update email template with new fields

### Phase 2: Address Autocomplete Component (Deferred)
- [x] ~~Create AddressAutocomplete component~~ (Deferred)
- [x] ~~Integrate Google Places API~~ (Deferred)
- [x] Use proper autocomplete attributes for browser autofill ✅

### Phase 3: Form Restructure ✅
- [x] Reorder form sections:
  1. Company Details (company name, contact name, email, phone)
  2. Delivery Address (with browser autocomplete)
  3. Billing Address (with "same as delivery" checkbox)
  4. Additional Notes
- [x] Add conditional billing address fields
- [x] Add proper autocomplete HTML attributes:
  - `autocomplete="organization"`
  - `autocomplete="name"`
  - `autocomplete="email"`
  - `autocomplete="tel"`
  - `autocomplete="shipping/billing street-address"`
  - `autocomplete="shipping/billing address-level2"` (suburb)
  - `autocomplete="shipping/billing postal-code"`

### Phase 4: Invoice-Style Summary Redesign ✅
- [x] Invoice-style table with columns:
  - Product name + size
  - SKU
  - Qty (EDITABLE inline - updates totals instantly)
  - Unit price
  - Line total (with discount display)
- [x] Summary section:
  - Subtotal
  - Volume discounts
  - Delivery: Free (Metro Road Freight)
  - Total (ex GST)
  - GST
  - Total (inc GST)
- [x] Conditions in form footer:
  - Delivery conditions (metro/freight depot note)
  - Quote validity (30 days)
  - GST notice

### Phase 5: Polish & Testing ✅
- [x] Mobile responsive layout (hidden columns on small screens)
- [x] Form validation UX (inline errors)
- [x] Loading states
- [x] Sidebar simplified with quick summary

---

## Dependencies

- **Google Places API** - For address autocomplete
  - Requires API key with Places API enabled
  - Billing account required
  - Fallback to manual entry if unavailable

- **Existing Services** (no changes):
  - SendGrid (email)
  - Turnstile (CAPTCHA)
  - Zod (validation)
  - react-hook-form

---

## New Environment Variables

```env
# Google Places API (for address autocomplete)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key_here
```

---

## Files to Create/Modify

### New Files
- `src/components/AddressAutocomplete.tsx`
- `src/components/QuoteInvoiceSummary.tsx`

### Modified Files
- `src/app/request-quote/page.tsx` (major changes)
- `src/app/api/quote/route.ts` (update schema)
- `.env.example` (add Google Places key)

---

## Form Field Hierarchy (Final)

```
1. Company Details
   ├── Company Name *
   ├── Email *
   └── Phone *

2. Delivery Address
   ├── Street Address * (autocomplete)
   ├── Suburb *
   ├── State *
   └── Postcode *

3. Billing Address
   ├── [x] Same as delivery (default checked)
   └── (If unchecked, show billing fields)

4. Products (read-only display)
   └── Invoice-style line items

5. Quote Summary
   ├── Subtotal
   ├── Volume Discounts
   ├── Delivery
   └── Total

6. Additional Notes (optional)
   └── Textarea

7. Conditions (static text)
   ├── Delivery note
   ├── Quote validity
   └── GST notice
```

---

## Notes

- Browser autofill should work with proper `autocomplete` attributes
- Google Places is optional enhancement - form works without it
- Metro detection could be added later (validate postcode)
- Material Test Certificate is out of scope for this phase
- Quote validity: 30 days from submission
