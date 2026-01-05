# Teekay Product Expansion

**Created**: 2026-01-05
**Type**: Content/Data
**Status**: Complete

## Summary

Add 7 Teekay pipe coupling products to expand the Teekay brand offering. Currently only 2 Teekay products exist in the database. This will add key coupling products from the Teekay range that complement our existing Orbit and Straub offerings.

## Scope
- **Impact**: Medium
- **Database Records**: 7 new products + variations
- **Components**: None (data only)
- **Brand**: Teekay (ID: 3)

## Products to Add

Based on Teekay product line and market relevance:

| # | Product | SKU | Category | Notes |
|---|---------|-----|----------|-------|
| 1 | Axilock-S | TKAXS | Pipe Couplings | Single casing, grip rings, seal & lock |
| 2 | Axilock | TKAX | Pipe Couplings | Double casing version |
| 3 | Axiflex | TKAF | Pipe Couplings | Flexible coupling, allows movement |
| 4 | Repair Coupling | TKRC | Pipe Repair | Quick repair for pressurized pipes |
| 5 | Stepped Coupling | TKSC | Pipe Couplings | Joins different diameter pipes |
| 6 | Reducer | TKRED | Pipe Couplings | Size reduction coupling |
| 7 | Flange Adapter | TKFA | Flange Adaptors | Coupling to flange connection |

## Data Requirements Per Product

From Teekay website, gather:
- [ ] Product name and description
- [ ] Key features (3-5 bullet points)
- [ ] Specifications (materials, pressure rating, temp range)
- [ ] Size range / variations
- [ ] Pricing (if available, else POA)
- [ ] Images (download from Teekay site)
- [ ] Datasheet PDF URL

## Phases

### Phase 1: Data Collection ✅
- [x] Fetch Axilock-S product details from Teekay website
- [x] Fetch Axilock product details
- [x] Fetch Axiflex product details
- [x] Fetch Repair Coupling details
- [x] Fetch Stepped Coupling details
- [x] Fetch Reducer details
- [x] Fetch Flange Adapter details
- [x] Download/note image URLs for each product

### Phase 2: Database Entry ✅
- [x] Create Axilock-S product record (ID: 160)
- [x] Create Axilock product record (ID: 161)
- [x] Create Axiflex product record (ID: 162)
- [x] Create Repair Coupling product record (ID: 163)
- [x] Create Stepped Coupling product record (ID: 164)
- [x] Create Reducer product record (ID: 165)
- [x] Create Flange Adapter product record (ID: 166)

### Phase 3: Verification ✅
- [x] Verify all 7 products in database
- [x] Products in correct categories:
  - Pipe Couplings: Axilock-S, Axilock, Axiflex, Stepped Coupling, Reducer
  - Pipe Repair: Repair Coupling
  - Flange Adaptors: Flange Adapter
- [ ] Images pending (POA products - no images on Teekay site)

## Technical Notes

### Database Insert Pattern
```typescript
// Use existing scripts or direct SQL
// Brand ID: 3 (Teekay)
// Category IDs:
//   - Pipe Couplings: 2
//   - Pipe Repair: 4
//   - Flange Adaptors: 6
```

### Image Handling
- Download from Teekay website
- Upload to Vercel Blob via admin or script
- Link in product_images table

### Pricing Strategy
- Most Teekay products: POA (price_varies: true, no base_price)
- Size variations without specific prices

## Dependencies

- Teekay website accessibility for product data
- Vercel Blob for image storage
- Admin access for product creation (or script)

## References

- Teekay Products: https://www.teekaycouplings.com/products/
- Axilock: https://www.teekaycouplings.com/products/axilock/
