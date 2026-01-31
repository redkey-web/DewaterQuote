# Custom Size Request Feature

## Overview

Add a "Can't see your size?" section to product pages allowing customers to request quotes for sizes not listed in the standard selector. This captures leads for Straub/Teekay products and any product where we don't stock all sizes.

**Key constraint:** This section should be **less prominent** than the existing size selector with pricing.

---

## Current System Understanding

### Existing Data Structures

**QuoteItem** (`src/types/index.ts`):
```typescript
interface QuoteItem {
  // ...existing fields...
  variation?: {
    size: string
    sizeLabel: string
    sku: string
    unitPrice: number  // 0 = POA
  }
  customSpecs?: {      // Currently Straub/Teekay only
    pipeOd: string
    rubberMaterial: 'EPDM' | 'NBR' | 'Viton' | 'GORE-TEX'
    pressure: string
    notes?: string
  }
}
```

**POA Handling** - Already implemented:
- `unitPrice: 0` or `basePrice: undefined` = POA
- Quote form separates priced vs unpriced items
- Email/PDF shows "POA" for unpriced items

### Key Files

| File | Role |
|------|------|
| `src/components/ProductDetailClient.tsx` | Size selector UI (lines 817-908) |
| `src/context/QuoteContext.tsx` | Cart state management |
| `src/lib/quote.ts` | Quote item conversion |
| `src/types/index.ts` | Type definitions |
| `src/app/api/quote/route.ts` | Quote submission |

---

## Implementation Plan

### Phase 1: Extend Types

**File:** `src/types/index.ts`

Add new field to QuoteItem:
```typescript
interface QuoteItem {
  // ...existing...
  customSizeRequest?: {
    requestedSize: string      // "150mm OD" or "DN200"
    additionalSpecs?: string   // Free-form notes
    isCustomRequest: true      // Flag for identification
  }
}
```

### Phase 2: Add Custom Size UI Component

**Create:** `src/components/CustomSizeRequest.tsx`

A collapsible section that appears **below** the standard size selector:

```
┌─────────────────────────────────────────┐
│ [Standard Size Selector - prominent]    │
│ 48.3mm ...................... $269.00   │
│ 60.3mm ...................... $285.00   │
│ [Confirm Size]                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ▸ Can't see your size?                  │  ← Collapsed by default
└─────────────────────────────────────────┘

When expanded:
┌─────────────────────────────────────────┐
│ ▾ Can't see your size?                  │
│                                         │
│ Tell us what you need and we'll get     │
│ back to you with a solution.            │
│                                         │
│ Size/Dimensions Required *              │
│ ┌─────────────────────────────────────┐ │
│ │ e.g., 150mm OD, DN200              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Additional Requirements (optional)      │
│ ┌─────────────────────────────────────┐ │
│ │ Material, pressure, application... │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Add to Quote - POA]                    │
└─────────────────────────────────────────┘
```

**Design principles:**
- Muted styling (gray border, smaller text)
- Collapsed by default
- Clear POA indication
- Simple: just size + notes fields

### Phase 3: Integrate into Product Detail Page

**File:** `src/components/ProductDetailClient.tsx`

Add `<CustomSizeRequest>` component after the size selector section:

```tsx
{/* Existing size selector */}
{product.sizeOptions && product.sizeOptions.length > 1 && (
  <SizeSelector ... />
)}

{/* NEW: Custom size request - below selector, less prominent */}
{product.sizeOptions && product.sizeOptions.length > 0 && (
  <CustomSizeRequest
    product={product}
    onAddToQuote={handleCustomSizeAdd}
  />
)}
```

### Phase 4: Update Quote Context

**File:** `src/context/QuoteContext.tsx`

Ensure `addItem` handles custom size requests:
- Custom requests should NOT merge with standard items
- Each custom request is a unique quote line

### Phase 5: Update Quote Conversion

**File:** `src/lib/quote.ts`

Add function for custom size items:
```typescript
function createCustomSizeQuoteItem(
  product: Product,
  customRequest: { requestedSize: string; additionalSpecs?: string },
  quantity: number
): QuoteItem {
  return {
    id: nanoid(),
    productId: product.id,
    name: product.name,
    brand: product.brand || '',
    category: product.category,
    image: product.images?.[0]?.url || '',
    priceVaries: false,
    basePrice: undefined,  // POA
    baseSku: product.sku,
    quantity,
    customSizeRequest: {
      requestedSize: customRequest.requestedSize,
      additionalSpecs: customRequest.additionalSpecs,
      isCustomRequest: true,
    },
  }
}
```

### Phase 6: Update Quote Display

**Files to update:**

1. `src/app/request-quote/page.tsx` - Show custom size in cart
2. `src/components/QuoteDrawer.tsx` - Show in side drawer
3. `src/app/api/quote/route.ts` - Include in email/database
4. `src/lib/pdf/quote-pdf.tsx` - Show in PDF

Display format:
```
Flex Grip S - Short Model Pipe Coupling
Size: Custom Request - 150mm OD
Notes: Need EPDM seal, 16 bar pressure
Qty: 2
Price: POA
```

### Phase 7: Database Schema (Optional)

**File:** `src/db/schema.ts`

Add columns to `quoteItems` table:
```typescript
customSizeRequested: text('custom_size_requested'),
customSizeNotes: text('custom_size_notes'),
isCustomRequest: boolean('is_custom_request').default(false),
```

---

## Files to Modify

| File | Action |
|------|--------|
| `src/types/index.ts` | Add `customSizeRequest` to QuoteItem |
| `src/components/CustomSizeRequest.tsx` | CREATE - New component |
| `src/components/ProductDetailClient.tsx` | Add CustomSizeRequest below size selector |
| `src/lib/quote.ts` | Add `createCustomSizeQuoteItem` function |
| `src/context/QuoteContext.tsx` | Handle custom size items |
| `src/app/request-quote/page.tsx` | Display custom size in cart |
| `src/components/QuoteDrawer.tsx` | Display custom size in drawer |
| `src/app/api/quote/route.ts` | Save custom size to DB, include in email |
| `src/lib/pdf/quote-pdf.tsx` | Include custom size in PDF |
| `src/db/schema.ts` | Add custom size columns |

---

## Decision Point

**Custom dimension fields:** Start simple with:
- Size/Dimensions Required (text input)
- Additional Requirements (textarea, optional)

Can extend later with product-specific fields if needed.

---

## Verification

1. **Build test:** `npm run build`
2. **UI test:**
   - Custom section collapsed by default
   - Less prominent than standard selector
   - Expands on click
3. **Quote flow:**
   - Add custom size item to cart
   - Shows "POA" pricing
   - Appears in quote drawer
   - Submits correctly
4. **Email/PDF:** Custom size details included
5. **Database:** Custom request saved correctly

---

## Out of Scope

- Product-specific custom fields (can add later)
- Auto-suggest sizes based on product range
- Integration with supplier inventory systems
