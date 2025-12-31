# Content Cleanup - Images & Descriptions

**Created**: 2026-01-01
**Updated**: 2026-01-01
**Type**: Data Migration
**Status**: ✅ Complete
**Priority**: High

## Summary

After importing 59 products from Neto CSV, we had:
- **63 products WITHOUT images** (50% of products)
- **64 products with raw HTML in descriptions** (`<p>`, `&nbsp;`, etc.)
- **Missing specs** (Body, Pressure fields empty)

### Results After Cleanup

| Metric | Before | After |
|--------|--------|-------|
| Products WITH images | 63 | **123** |
| Products WITHOUT images | 63 | **3** |
| Products with HTML descriptions | 64 | **0** |
| Products with specs populated | 0 | **58** |

**3 products still missing images** (not in Neto API):
- YSTR-CI, REJ-EPDM, OCRC55X

## Issues Identified

### 1. Missing Product Images

Products imported from Neto CSV don't have images because:
- CSV export doesn't include image URLs
- Need to fetch images from Neto API or download from old site

**Products affected**: 63 (see list below)

### 2. Raw HTML in Descriptions

Descriptions imported from Neto contain HTML tags:
```
<p>The stainless steel flange adapter is a problem solver...</p>
<p>- Different sizes...</p>
```

Should be clean text for display.

**Products affected**: 64

### 3. Missing Specifications

The Neto CSV has a "Bullet points" column with specs like:
```html
<ul><li>Size From: 100mm</li><li>Body: WCB/Stellite</li><li>Pressure Range: 0 - 20 BAR</li></ul>
```

This data needs to be extracted and populated into:
- `materials.body` field
- `pressureRange` field
- `sizeFrom` field

---

## Solution: Image Download

### Option A: Neto API (Recommended)

The GetItem API returns image URLs:
```json
{
  "Images": {
    "Image": [{
      "Name": "product.jpg",
      "URL": "https://www.dewaterproducts.com.au/assets/full/product.jpg",
      "ThumbURL": "https://www.dewaterproducts.com.au/assets/thumb/product.jpg"
    }]
  }
}
```

**Steps**:
1. Call GetItem API for each product with `Images` OutputSelector
2. Download images from URLs
3. Upload to Vercel Blob
4. Update `product_images` table

### Option B: Neto Control Panel Bulk Export

In Neto cpanel:
1. Settings & Tools → Export Data
2. Select "Media Files" or check for bulk image export option
3. Download zip of all product images
4. Upload to Vercel Blob

### Option C: Scrape from Old Site

If API/export not available:
1. Scrape image URLs from product pages on dewaterproducts.com.au
2. Download images
3. Upload to Vercel Blob

---

## Solution: Description Cleanup

### HTML Stripping

Create a function to clean HTML:
```typescript
function cleanDescription(html: string): string {
  return html
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '') // Remove remaining tags
    .replace(/\n{3,}/g, '\n\n')     // Collapse multiple newlines
    .trim();
}
```

### Bullet Point Extraction

Parse specs from "Bullet points" column:
```typescript
function extractSpecs(bulletHtml: string): { sizeFrom?: string; body?: string; pressure?: string } {
  const specs: Record<string, string> = {};
  const matches = bulletHtml.matchAll(/<li>([^:]+):\s*([^<]+)<\/li>/g);
  for (const match of matches) {
    const key = match[1].trim().toLowerCase();
    const value = match[2].trim();
    if (key.includes('size')) specs.sizeFrom = value;
    if (key.includes('body')) specs.body = value;
    if (key.includes('pressure')) specs.pressure = value;
  }
  return specs;
}
```

---

## Tasks

### Phase 1: Image Download
- [ ] **Get NETO_API_KEY from Neto cpanel**:
  1. Login to https://www.dewaterproducts.com.au/cpanel/
  2. Go to: Settings & Tools → All Settings & Tools → API
  3. Generate or copy API Key
  4. Add to `.env.local`: `NETO_API_KEY=your_key_here`
- [x] Create script: `scripts/download-neto-images.ts`
  - [x] Fetch image URLs from Neto API
  - [x] Download to local folder
  - [ ] Upload to Vercel Blob
  - [ ] Update product_images table
- [ ] Run script for 63 products (requires API key)

### Phase 2: Description Cleanup ✅ COMPLETE
- [x] Create script: `scripts/clean-descriptions.ts`
  - [x] Strip HTML tags
  - [x] Convert `&nbsp;` to spaces
  - [x] Convert `<p>` to paragraph breaks
- [x] Run script for 64 products - **ALL 64 CLEANED**

### Phase 3: Specs Population ✅ COMPLETE
- [x] Create script: `scripts/populate-specs.ts`
  - [x] Parse "Bullet points" column from CSV
  - [x] Extract Body, Pressure, Size From
  - [x] Update products table
- [x] Run script - **58 PRODUCTS UPDATED**

### Phase 4: Verification
- [ ] Check product pages display correctly
- [ ] Verify images load
- [ ] Verify descriptions are clean text

---

## Products Missing Images (63)

```
YSTR-CI, REJ-EPDM, OCRC55X, BCVCIF, BV3WAY316, DB-1,
BCV316TE, BVFA150, CIYSE, CRREJ, CRSREJA, D-SERIESENCAP,
DAREJ, DB4DCV, FVHDPE, DBCVFE, DBS3W316, DBSTPB316,
DBSTPBCS, DFAREJ, ECCREJ, ENCAPRC-SS, SSSCV150, ERFREJ,
ERREJ, FCBSCS, FlexGrip2PLong, FSF-BREJ, FSFREJ_316SS,
FSS316, FVHLOCL150, FVSSD, GVCF8M150, GVCF8MTE, ILDBCV,
LOKGV316MS, LOKGV316RS, MCATDE, OCELBRC, OCOF200-L,
OCOF300-L, OCOF400-L, OCRC100wide, OCRC400, OSSBS,
PTFEFSFREJ, QAREJ, RSSCVTE, SAREJ, SBS316-ANSI150,
SBS316-ASPN16, SBS316-TD_, SBS316-TE, SBSCS, SFAREJ,
SGL, TAREJ, TSREJFTF, UDC, WCBSCV150LB, WCBSCV300LB,
WCBYS, OCFGO-S
```

## Products with HTML in Description (64)

```
OCFLAD, OCFG2-S, OCFG2-L, OCPC, BCVCIF, BV3WAY316,
OCFGO-L, BCV316TE, BVFA150, CIYSE, CRREJ, CRSREJA,
D-SERIESENCAP, DAREJ, DB4DCV, FVHDPE, DBCVFE, DBS3W316,
DBSTPB316, DBSTPBCS, DFAREJ, ECCREJ, ENCAPRC-SS, SSSCV150,
ERFREJ, ERREJ, FCBSCS, FlexGrip2PLong, FSF-BREJ, FSFREJ_316SS,
FSS316, FVHLOCL150, FVSSD, GVCF8M150, GVCF8MTE, ILDBCV,
LOKGV316MS, LOKGV316RS, MCATDE, OCELBRC, OCOF200-L,
OCOF300-L, OCOF400-L, OCRC100wide, OCRC400, OSSBS,
PTFEFSFREJ, QAREJ, RSSCVTE, SAREJ, SBS316-ANSI150,
SBS316-ASPN16, SBS316-TD_, SBS316-TE, SBSCS, SFAREJ,
SGL, TAREJ, TSREJFTF, UDC, WCBSCV150LB, WCBSCV300LB,
WCBYS, OCFGO-S
```

---

## Estimate

| Phase | Time |
|-------|------|
| Image download script | 2-3 hrs |
| Image upload & DB update | 1-2 hrs |
| Description cleanup | 1 hr |
| Specs population | 1 hr |
| Verification | 30 min |
| **Total** | **5-7 hrs** |

---

## Related

- [[product-price-audit.md]] - Data sync from Neto
- [[inventory-management-system.md]] - Product data fields
