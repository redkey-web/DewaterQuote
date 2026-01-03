# Image Audit & Replacement Plan

**Created**: 2026-01-04
**Completed**: 2026-01-04
**Type**: Data cleanup / Quality assurance
**Status**: ✅ Complete

## Summary

Identify product images that were manually created/modified (not copied from the live Neto site dewaterproducts.com.au), then replace them with original images from the live site. Straub products are excluded from this audit.

## Scope
- **Impact**: Medium
- **Products affected**: 21 (non-Straub products with non-Neto images)
- **Images to replace**: ~30+ images

---

## Products Requiring Image Replacement

### Defender Valves (5 products)

| SKU | Product Name | Non-Neto Images |
|-----|--------------|-----------------|
| BFLYW316 | Butterfly Valve - CF8M Full 316 Stainless Steel - PTFE - Wafer Universal | 2/2 |
| CF8MDAFV | CF8M Flanged Float Valve AS4087 PN16 | 3/3 |
| BFLYLE316 | Lugged Butterfly Valve - CF8M 316 Stainless Steel - EPDM or PTFE - Table E | 3/3 |
| CF8MWEBFVL | CF8M Wafer Butterfly Valve - EPDM - Lever Operated | 3/3 |
| FVHDPE | Foot Valve - HDPE - Flanged Table E | (has Neto images, verify) |

### Orbit Couplings (11 products)

| SKU | Product Name | Non-Neto Images |
|-----|--------------|-----------------|
| OCRC55 | Orbit Pipe Repair Clamp Series 1 and 55mm long | 1/1 |
| OCFG-S | Flex Grip S - Short Model Pipe Coupling | 1/1 |
| OCML-L | Metal Lock L - Long Model with Axial Restraint | 1/1 |
| OCML-S | Metal Lock S - Short Model with Axial Restraint | 1/1 |
| OCFPC | Fire Protection Coupling - IACS Compliant | 1/1 |
| OCERC | Elbow Repair Clamp - Orbit Couplings | 1/1 |
| OCOF300L | Open Flex 300-L - Large Diameter Pipe Coupling | 1/1 |
| OCOF400L | Open Flex 400-L - Extra Large Diameter Pipe Coupling | 1/1 |
| OCRC200 | Orbit Pipe Repair Clamp 200mm Wide | 1/1 |
| OCRC300 | Orbit Pipe Repair Clamp 300mm Wide | 1/1 |
| OCFLAD | Flange Adapter Flex Grip S | 4/4 |

### Defender Strainers (2 products)

| SKU | Product Name | Non-Neto Images |
|-----|--------------|-----------------|
| SSYS | Stainless Steel Y Strainer CF8M Flanged ANSI 150LB | 1/1 |
| SBSANSI | ANSI 150LB 316SS Simplex Basket Strainer | 1/1 |

### Teekay (2 products)

| SKU | Product Name | Non-Neto Images |
|-----|--------------|-----------------|
| FSFREJ | FSF Single Sphere Rubber Expansion Joint - Table E / ANSI 150LB Zinc Flanges | 1/1 |
| SSFA | Stainless Steel Flange Adapter - 316SS Body with EPDM Seal | 4/4 |

### Bore-Flex Rubber (1 product)

| SKU | Product Name | Non-Neto Images |
|-----|--------------|-----------------|
| BF-TSREJFTF | Bore-Flex Twin Sphere Rubber Expansion Joint FTF | 1/1 |

### Test Product (1 product - TO DELETE)

| SKU | Product Name | Non-Neto Images |
|-----|--------------|-----------------|
| TST_001 | Test Product | 1/1 |

---

## Phases

### Phase 1: Setup & Test Product Cleanup ✅
- [x] Delete test product TST_001 from database
- [x] Verify live site access at dewaterproducts.com.au

### Phase 2: Defender Valves Image Replacement ✅
- [x] BFLYW316 - 3 images imported
- [x] CF8MDAFV - 2 images imported
- [x] BFLYLE316 - 2 images imported
- [x] CF8MWEBFVL - 4 images imported

### Phase 3: Orbit Couplings Image Replacement ✅
- [x] OCRC55, OCRC200, OCRC300 - Repair clamps (4 images each)
- [x] OCFG-S - Flex Grip S (3 images)
- [x] OCML-L, OCML-S - Metal Lock models (4 images each)
- [x] OCFPC - Fire Protection Coupling (4 images)
- [x] OCERC - Elbow Repair Clamp (5 images, SKU on live: OCELBRC)
- [x] OCOF300L, OCOF400L - Open Flex large (4 images each)
- [x] OCFLAD - Flange Adapter (3 images)

### Phase 4: Strainers & Other Brands ✅
- [x] SSYS - Y Strainer (4 images)
- [x] SBSANSI - Basket Strainer (4 images)
- [x] FSFREJ - Rubber Expansion Joint (4 images)
- [x] SSFA - ⚠️ Removed wrong images. Product doesn't exist on live site (Teekay-only). Needs manual image sourcing.
- [x] BF-TSREJFTF - Twin Sphere Expansion Joint (2 images)

### Phase 5: Verification ✅
- [x] All replaced images uploaded to Vercel Blob
- [x] Old non-original images deleted from Blob storage
- [x] product_images table updated with new URLs

---

## Process for Each Product

1. **Search live site**: Go to `dewaterproducts.com.au` and search for product name/SKU
2. **Download images**: Right-click save all product images from best match
3. **Upload to Blob**: Use admin panel or script to upload to Vercel Blob
4. **Update database**: Replace product_images entries with new URLs
5. **Delete old images**: Remove non-original images from Blob storage

---

## Live Site Search URLs

Base URL: `https://dewaterproducts.com.au/`

Search pattern: `https://dewaterproducts.com.au/catalogsearch/result/?q={PRODUCT_NAME}`

---

## Notes

- Straub products are EXCLUDED from this audit (they have official brand images)
- Some products may have been discontinued on live site - document if not found
- Prioritize products that are actively displayed on category pages
- Images from Neto export (following /products/{SKU}/ pattern) are considered original

---

## Dependencies

- Access to dewaterproducts.com.au
- Vercel Blob storage access
- Database write access
