# Quote System - Automated Quotes & PDF Generation

**Created**: 2026-01-10
**Type**: Major Enhancement
**Status**: Active
**Priority**: Critical (Pre-Launch)
**Combined from**:
  - automated-quote-system.md
  - pdf-attachment-debug.md

## Summary

Transform the quote system into fully automated formal quotes. Customers receive complete, accurate quotes (PDF + email) instantly. 99% of quotes require zero manual intervention. Also includes fixing the PDF attachment issue in initial automated emails.

## Current State

| Aspect | Current | Target |
|--------|---------|--------|
| Terminology | "Quote Request" → "Quote" | ✅ Complete |
| Customer PDF | Full pricing, terms | ✅ Complete |
| PDF Delivery | ✅ Using @react-pdf/renderer | ✅ Fixed (2026-01-10) |
| Delivery | Metro=free, Non-metro=TBC | ✅ Complete |
| Lead times | Not shown | Per-product lead times |

## Scope

- **Impact**: High
- **Files**: ~15-20 estimated
- **Components**: Quote form, PDF generator, Email templates, API route

---

## Phase 1: Fix PDF Attachment in Automated Emails (Critical)

### Problem
Customer quote emails from `/api/quote/route.ts` arrive **without PDF attachments**. Business email arrives, customer email arrives, but no PDF is attached.

### Root Cause
There are **two different PDF generation systems**:
| Route | Library | Status |
|-------|---------|--------|
| Initial automated | `@react-pdf/renderer` | ✅ FIXED (was pdfmake) |
| Admin "Send Quote" | `@react-pdf/renderer` | ✅ Working |

### 1.1 Diagnose Issue (Complete)
- [x] Root cause identified: pdfmake not working in serverless
- [x] Solution: migrated to @react-pdf/renderer (same as admin route)

### 1.2 Fix: Migrate to @react-pdf/renderer (Recommended)
Per Context7 patterns, use `renderToBuffer()` which is proven to work:

```typescript
import { renderToBuffer } from '@react-pdf/renderer';
import { QuotePDF, type QuotePDFData } from '@/lib/pdf/quote-pdf';

const pdfBuffer = await renderToBuffer(QuotePDF({ data: pdfData }));
const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
```

- [x] Update `/api/quote/route.ts` to use @react-pdf/renderer
- [x] Map initial quote data to QuotePDFData format
- [x] Test PDF generation locally (build passes)
- [x] Verify email with attachment in preview deployment (deployed in commit 3cb0e11)
- [x] Deploy to production and confirm PDFs arriving

### 1.3 Cleanup (After Fix) ✅
- [x] Removed `src/lib/generate-quote-pdf.ts` (orphaned pdfmake file)
- [x] Removed pdfmake + @types/pdfmake from package.json (8 packages removed)

---

## Phase 2: Quote Format Refinements (Completed) ✅

- [x] PDF includes unit prices, line totals, GST calculation
- [x] Validity period: "Valid for 30 days"
- [x] Payment terms: "14 days from invoice"
- [x] ABN and company details in footer
- [x] Delivery classification (metro/non-metro)

---

## Phase 3: Lead Times Per Product

### 3.1 Database Update
- [x] Add `leadTime` column to products table (already exists in schema.ts:72)
- [x] Default value: "2-3 weeks" (handled in form)
- [x] Options: "In Stock", "1-2 weeks", "2-3 weeks", "3-4 weeks", "4-6 weeks" (free text input)

### 3.2 Admin Management
- [x] Add lead time field to product edit form (ProductForm.tsx:835-843)
- [x] Bulk update capability (InventoryManagementTable.tsx:952-966, route.ts:55-61)

### 3.3 Quote Display
- [x] Show lead time per item in PDF (quote-pdf.tsx:412)
- [x] Show overall lead time (longest item) (quote-pdf.tsx:489-504, route.ts:calculateOverallLeadTime)
- [x] Include in customer email (route.ts:660-672)

---

## Phase 4: Quote Format Enhancements

### 4.1 Expiry Date Logic
- [x] Expiry = end of following month (lib/quote.ts:getQuoteExpiry)
- [x] Function: `getQuoteExpiry(date: Date): Date` - uses date-fns endOfMonth+addMonths
- [x] Updated all routes: quote, pdf, approve-quote, send, forward, email-preview, demo

### 4.2 Christmas Shutdown Logic
- [x] REMOVED: Not required - client will handle this manually
- ~~If date is Dec 5 - Jan 15: Add 2-3 weeks to lead times~~
- ~~Flag in business email: "Christmas period - extended lead times"~~

### 4.3 Price Display Format
- [x] Show "Unit (ex GST)" / "Total (ex GST)" headers in quote form, PDF, and emails

---

## Phase 5: Internal Notifications

### 5.1 Exception Detection
- [x] Non-metro delivery flag
- [x] Large quantity flag (>10 total items)
- [x] Long lead time items (>4 weeks)

### 5.2 Business Email Updates
- [x] Add "Flags" section at top of email
- [x] Visual indicators (emoji or styled badges)
- [x] Default expectation: "No action required"

---

## Phase 6: Validation & Polish

### 6.1 Form Validation
- [x] Phone number format validation (8-15 digits, valid phone characters)
- [x] Email format validation (Zod .email())
- [x] Postcode format validation (4 digits for AU - regex)

### 6.2 Testing
- [x] Playwright tests pass (quote-form.spec.ts - 8 tests)
- [x] Build passes with all changes
- [ ] Manual test: metro postcode flow (needs SendGrid in production)
- [ ] Manual test: non-metro postcode flow (needs SendGrid in production)
- [ ] Manual test: PDF generation with all scenarios
- [ ] Manual test: email delivery verification

---

## Context7 Pattern: PDF Generation

Use `@react-pdf/renderer` with `renderToBuffer()` for serverless-compatible PDF generation:

```javascript
import { renderToBuffer } from '@react-pdf/renderer';

const pdfBuffer = await renderToBuffer(
  <Invoice invoiceNumber={data.number} amount={data.amount} />
);

// For email attachment
await transporter.sendMail({
  attachments: [{
    filename: `invoice-${data.number}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf',
  }],
});
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/api/quote/route.ts` | Replace pdfmake with @react-pdf/renderer |
| `src/lib/generate-quote-pdf.ts` | Deprecate after migration |
| `src/db/schema.ts` | Add leadTime to products |
| `src/app/admin/products/*/page.tsx` | Lead time field |

---

## Source References
- Original: `.planning/combined-sources/automated-quote-system.md`
- Original: `.planning/combined-sources/pdf-attachment-debug.md`

---

Last Updated: 2026-01-10 (PDF fix implemented)
