# PDF Attachment Debug - Initial Automated Emails

**Created**: 2026-01-09
**Type**: Bug Fix
**Status**: In Progress

## Problem

Customer quote emails (sent via `/api/quote/route.ts`) are arriving **without PDF attachments**. The business email arrives, the customer email arrives, but no PDF is attached to the customer email.

## Root Cause Analysis

### System Architecture

There are **two different PDF generation systems**:

| Route | Library | File | Status |
|-------|---------|------|--------|
| Initial automated | `pdfmake` | `src/lib/generate-quote-pdf.ts` | ❌ NOT WORKING |
| Admin "Send Quote" | `@react-pdf/renderer` | `src/lib/pdf/quote-pdf.tsx` | ✅ Working |
| Admin "Forward" | `@react-pdf/renderer` | same | ✅ Working |

### Why Two Systems?

The initial quote system was built with `pdfmake` because:
- It can generate PDFs from pure JavaScript objects
- No React component rendering required in API routes
- Works well in Node.js environments

Admin routes use `@react-pdf/renderer` because:
- Better integration with React components
- More sophisticated layout control
- Used later when admin panel was built

### Suspected Issues

1. **pdfmake serverless compatibility** - pdfmake uses streaming which may behave differently in Vercel serverless
2. **Font loading** - Even using built-in Helvetica, font initialization might fail silently
3. **Promise/Buffer handling** - The PDF generation wraps in a manual Promise that might not resolve properly
4. **Timeout** - PDF generation might be timing out before completion

---

## Phase 1: Verify Current Behavior

### 1.1 Check Vercel Logs
- [ ] Navigate to Vercel Dashboard → Functions → Logs
- [ ] Filter for `/api/quote` function
- [ ] Look for these log messages:
  ```
  [Quote QR-XXXXX] Starting PDF generation...
  [Quote QR-XXXXX] PDF buffer size: XXXX bytes
  [Quote QR-XXXXX] PDF generated: XXXX chars base64
  ```
- [ ] OR look for:
  ```
  [Quote QR-XXXXX] Failed to generate PDF: [error]
  [Quote QR-XXXXX] WARNING: No PDF generated
  ```

### 1.2 Test Submission
- [ ] Submit a test quote on production
- [ ] Check both email addresses for:
  - Business email (with admin link)
  - Customer email (should have PDF)
- [ ] Note the quote number for log correlation

### 1.3 Document Findings
- [ ] Record what appears in logs
- [ ] Record attachment status
- [ ] Identify failure point

---

## Phase 2: Diagnose Root Cause

Based on Phase 1 findings, follow the appropriate path:

### Path A: No logs appear
**Diagnosis**: PDF generation is crashing the function

Fix approach:
- Add try/catch with detailed error logging around entire PDF flow
- Check if pdfmake initialization fails
- Verify @types/pdfmake is correct version

### Path B: Logs show "Failed to generate PDF"
**Diagnosis**: pdfmake is throwing an error

Fix approach:
- Parse the error message
- Common issues: font loading, document definition errors, memory
- May need to simplify PDF or add error recovery

### Path C: Logs show PDF generated but no attachment in email
**Diagnosis**: SendGrid attachment format issue

Fix approach:
- Verify attachment object structure
- Check base64 encoding is valid
- Ensure content-type is correct

### Path D: Logs show small buffer size (< 1000 bytes)
**Diagnosis**: PDF generation incomplete

Fix approach:
- pdfDoc.end() might not be waiting properly
- Promise might resolve too early
- Need to verify streaming completion

---

## Phase 3: Implement Fix

### Option A: Fix pdfmake Implementation

If pdfmake can be made to work:

```typescript
// Add timeout and better error handling
export async function generateQuotePDF(data: QuotePDFData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('PDF generation timed out after 30s'))
    }, 30000)

    try {
      const pdfMakePrinter = new PdfPrinter(fonts)
      const pdfDoc = pdfMakePrinter.createPdfKitDocument(docDefinition)
      const chunks: Buffer[] = []

      pdfDoc.on("data", (chunk: Buffer) => {
        console.log(`PDF chunk received: ${chunk.length} bytes`)
        chunks.push(chunk)
      })

      pdfDoc.on("end", () => {
        clearTimeout(timeout)
        const result = Buffer.concat(chunks)
        console.log(`PDF complete: ${result.length} total bytes`)
        resolve(result)
      })

      pdfDoc.on("error", (err) => {
        clearTimeout(timeout)
        reject(err)
      })

      pdfDoc.end()
    } catch (error) {
      clearTimeout(timeout)
      reject(error)
    }
  })
}
```

### Option B: Switch to @react-pdf/renderer (Recommended)

Migrate initial quote PDF to use the same system as admin routes:

1. Create `generateInitialQuotePDF()` function using `@react-pdf/renderer`
2. Reuse existing `QuotePDF` component if data shapes are compatible
3. Use `renderToBuffer()` which is proven to work

```typescript
// In /api/quote/route.ts
import { renderToBuffer } from '@react-pdf/renderer'
import { QuotePDF, type QuotePDFData } from '@/lib/pdf/quote-pdf'

// Map initial quote data to QuotePDFData format
const pdfData: QuotePDFData = {
  quoteNumber,
  quoteDate: format(new Date(), 'd MMMM yyyy'),
  validUntil: format(addDays(new Date(), 30), 'd MMMM yyyy'),
  // ... map other fields
}

const pdfBuffer = await renderToBuffer(QuotePDF({ data: pdfData }))
const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
```

---

## Phase 4: Test & Verify

### 4.1 Local Testing
- [ ] Run `npm run dev`
- [ ] Submit test quote
- [ ] Check local logs for PDF generation
- [ ] Verify email with attachment (if SendGrid configured locally)

### 4.2 Preview Deployment
- [ ] Deploy to Vercel preview branch
- [ ] Submit test quote
- [ ] Check Vercel logs
- [ ] Verify customer email has PDF attachment

### 4.3 Production Deployment
- [ ] Merge to main
- [ ] Monitor first few real quotes
- [ ] Confirm PDFs arriving

---

## Implementation Decision

**Recommended: Option B (Switch to @react-pdf/renderer)**

Reasons:
1. **Proven working** - Admin routes already use it successfully
2. **Consistent codebase** - One PDF library, one approach
3. **Less debugging** - Don't need to figure out why pdfmake fails
4. **Better support** - @react-pdf is more actively maintained for Next.js/Vercel

Trade-offs:
- Need to map data from quote form format to QuotePDFData format
- Slight PDF layout differences (but can match if needed)

---

## Files to Modify

| File | Change |
|------|--------|
| `src/app/api/quote/route.ts` | Replace pdfmake call with @react-pdf/renderer |
| `src/lib/generate-quote-pdf.ts` | Can be deprecated/removed after migration |
| `package.json` | Can remove pdfmake dependencies (optional cleanup) |

---

## Current Logging (Already Added)

```typescript
// Lines 552-586 in route.ts
console.log(`[Quote ${quoteNumber}] Starting PDF generation...`)
console.log(`[Quote ${quoteNumber}] PDF buffer size: ${pdfBuffer?.length || 0} bytes`)
console.log(`[Quote ${quoteNumber}] PDF generated: ${pdfBase64.length} chars base64`)
// OR
console.log(`[Quote ${quoteNumber}] Failed to generate PDF:`, pdfError)
console.log(`[Quote ${quoteNumber}] WARNING: No PDF generated`)
```

---

## Next Steps

1. **Immediate**: Check Vercel logs with existing instrumentation
2. **Based on findings**: Either fix pdfmake or migrate to @react-pdf
3. **Test**: Verify fix in preview before production

---

Last Updated: 2026-01-09
