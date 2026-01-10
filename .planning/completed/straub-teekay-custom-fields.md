# Straub/Teekay Custom Product Fields

**Created**: 2026-01-09
**Completed**: 2026-01-09
**Type**: Feature
**Status**: Complete

## Summary

Straub and Teekay products are pipe couplings where customers need to specify their own pipe specifications rather than selecting from predefined sizes. This feature removes predefined size options from Straub/Teekay products and adds custom input fields for customers to enter their pipe specifications when adding products to their quote.

## Scope

- **Impact**: Medium
- **Files**: ~10 files
- **Brands Affected**: Straub, Teekay only (Orbit unchanged)

## Custom Fields Required

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Pipe OD Size | Text input | Yes | None (flexible format: "48.3mm", "2 inch") |
| Rubber Material | Dropdown | Yes | EPDM, NBR, Viton |
| System Operating Pressure | Text input | Yes | Max 25 characters |
| Additional Comments | Textarea | No | None |

### Rubber Material Options (with helper text)

- **EPDM**: General purpose, excellent water resistance (-40°C to +120°C)
- **NBR**: Oil/fuel resistant, hydraulic fluids (-30°C to +100°C)
- **Viton (FKM)**: High temperature, chemical resistant (-20°C to +200°C)

## Phases

### Phase 1: Database & Types (Foundation) ✓
- [x] Add columns to quote_items table via migration:
  - `custom_pipe_od TEXT`
  - `custom_rubber_material TEXT`
  - `custom_pressure TEXT`
  - `custom_notes TEXT`
- [x] Update `src/db/schema.ts` with new columns
- [x] Update `src/types/index.ts` QuoteItem interface with optional custom fields
- [x] Delete product_variations for Straub/Teekay products (brandId 2, 3) - 22 variations removed
- [x] Verify database changes with test query

### Phase 2: Quote Library Updates ✓
- [x] Add `isCustomSpecsBrand(brand: string): boolean` helper to `src/lib/quote.ts`
- [x] Update `productToQuoteItem()` to accept and pass custom specs
- [x] Update `ProductToQuoteItemOptions` interface

### Phase 3: Product Detail Page UI ✓
- [x] Create custom specs form section in `ProductDetailClient.tsx`
- [x] Add state for custom spec fields: pipeOD, rubberMaterial, pressure, notes
- [x] Implement Rubber Material dropdown with descriptions
- [x] Add validation for required fields before add to quote
- [x] Conditional rendering: show custom form for Straub/Teekay, standard size selector for Orbit
- [x] Update `handleAddToQuote()` to include custom specs

### Phase 4: Quote Cart & Review Display ✓
- [x] Update `QuoteCart.tsx` to display custom specs for Straub/Teekay items
- [x] Format: "Pipe OD: 48.3mm | Material: EPDM | Pressure: 16 bar"
- [x] Show additional notes if present
- [x] Update `request-quote/page.tsx` items table to show custom specs

### Phase 5: API & Email Updates ✓
- [x] Update `api/quote/route.ts` request schema to accept custom specs
- [x] Save custom specs to quote_items table
- [x] Update customer email HTML template to include custom specs
- [x] Update admin notification email to include custom specs

### Phase 6: Admin & PDF Updates ✓
- [x] Update `admin/quotes/[id]/QuoteDetail.tsx` to display custom specs
- [ ] Update PDF generation (if using @react-pdf/renderer) to include specs - skipped for now
- [ ] Update "Forward to Customer" email template - uses same itemsTableRows
- [x] Test full quote flow with custom specs - build passes

## Files to Modify

| File | Changes |
|------|---------|
| `src/db/schema.ts` | Add 4 custom spec columns to quoteItems |
| `src/types/index.ts` | Add custom spec fields to QuoteItem interface |
| `src/lib/quote.ts` | Add helper function, update productToQuoteItem |
| `src/components/ProductDetailClient.tsx` | Add custom specs form, conditional UI |
| `src/components/QuoteCart.tsx` | Display custom specs in cart |
| `src/app/request-quote/page.tsx` | Display custom specs in review table |
| `src/app/api/quote/route.ts` | Accept & save custom specs, update emails |
| `src/app/admin/quotes/[id]/QuoteDetail.tsx` | Display custom specs |
| `src/context/QuoteContext.tsx` | No changes needed (passes QuoteItem through) |

## Database Migration

```sql
-- Add custom spec columns
ALTER TABLE quote_items ADD COLUMN IF NOT EXISTS custom_pipe_od TEXT;
ALTER TABLE quote_items ADD COLUMN IF NOT EXISTS custom_rubber_material TEXT;
ALTER TABLE quote_items ADD COLUMN IF NOT EXISTS custom_pressure TEXT;
ALTER TABLE quote_items ADD COLUMN IF NOT EXISTS custom_notes TEXT;

-- Remove Straub/Teekay product variations (brandId 2=Straub, 3=Teekay)
DELETE FROM product_variations
WHERE product_id IN (
  SELECT id FROM products WHERE brand_id IN (2, 3)
);
```

## Dependencies

- None (uses existing UI components: Select, Input, Textarea from shadcn/ui)

## Notes

- Straub and Teekay products will become "POA" (Price on Application) items
- Custom specs are stored as snapshots - changes to rubber material options won't affect existing quotes
- Consider adding admin ability to configure rubber material options in future
- Default rubber material: EPDM (most common for water applications)
