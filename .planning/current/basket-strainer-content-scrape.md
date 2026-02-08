# Basket Strainer Content Scrape from Neto

**Created**: 2026-01-16
**Completed**: 2026-01-16
**Type**: Data Migration
**Status**: Complete

## Summary

Scrape all basket strainer product pages from the live Neto site to collect any missing images, videos, and datasheets that weren't migrated to the new site.

## Research Findings

### Neto Site Structure
- **Search URL**: `https://www.dewaterproducts.com.au/?rf=kw&kw=BASKET`
- **Products found**: 10 basket strainer products
- **Image URL patterns**:
  - Main: `/assets/full/{SKU}.jpg`
  - Alt 1: `/assets/alt_1/{SKU}.jpg`
  - Alt 2: `/assets/alt_2/{SKU}.jpg`
  - Thumbs: `/assets/thumb/{SKU}.jpg`
- **Videos**: None found on Neto pages (confirmed via Neto CSV - 0 basket strainers have YouTube IDs)
- **Datasheets**: Already inventoried at `/assets/brochures/{SKU}.pdf`

### Current Database State
- **16 strainer products** in database (all have 2-5 images each in Vercel Blob)
- **Only 1 product (FSS316)** has a datasheet linked
- **No videos** for any strainer products

### Products to Scrape
| SKU | Product Name | Neto URL |
|-----|--------------|----------|
| DBS3W316 | Duplex Basket Strainer 316SS 3-way | duplex-basket-strainer-316ss-fitted-with-3-way-fla~940 |
| DBSTPB316 | Duplex Basket Strainer 316SS butterfly | duplex-basket-strainer-316ss-fitted-with-ss-butter~945 |
| DBSTPBCS | Duplex Basket Strainer Carbon Steel | duplex-basket-strainer-carbon-steel-fitted-with-di |
| FCBSCS | Fabricated Simplex Basket Strainer | fabricated-simplex-basket-strainer-flanged-ansi-15 |
| OSSBS | Oversized Simplex Basket Strainer | oversized-simplex-basket-strainer |
| SBS316-ANSI150 | Simplex Basket 316SS ANSI 150LB | simplex-basket-strainer-316-ss-flanged-ansi-150lb |
| SBS316-ASPN16 | Simplex Basket 316SS AS4087 PN16 | simplex-basket-strainer-316-ss-flanged-as4087-pn16 |
| SBS316-TD_ | Simplex Basket 316SS Table D | simplex-basket-strainer-316-ss-flanged-table-d |
| SBS316-TE | Simplex Basket 316SS Table E | simplex-basket-strainer-316-ss-flanged-table-e |
| SBSCS | Simplex Basket Cast Steel | simplex-basket-strainer-cast-steel-flanged-ansi-15 |

## Scope

- **Impact**: Low (data enrichment only)
- **Files**: ~3 scripts, no component changes
- **Risk**: Minimal - additive content only

## Phases

### Phase 1: Create Scraper Script
- [x] Create `scripts/scrape-neto-basket-strainers.ts`
- [x] Use fetch to get each product page HTML
- [x] Extract: main image URL, alt image URLs, video embeds (YouTube iframe)
- [x] Save results to `.planning/audit/neto-basket-scrape.json`

### Phase 2: Compare with Database
- [x] Load current product_images from database for basket strainer SKUs
- [x] Compare image URLs/counts
- [x] Identify missing alt images - **NONE FOUND** (DB already has all images)
- [x] No datasheets for basket strainers (confirmed by user)

### Phase 3: Import Missing Content
- [x] Created `scripts/import-basket-strainer-videos.ts`
- [x] Added 7 YouTube videos to products table
- [~] No missing images to import (DB already complete)

### Phase 4: Verification
- [x] Verified videos added via dry-run comparison

## Results

### Videos Added (7 products)
| SKU | YouTube Video ID |
|-----|-----------------|
| DBSTPB316 | dJ5IdyXBAe4 |
| OSSBS | VGW2e69GGPw |
| SBS316-ANSI150 | SFkOtQawRKU |
| SBS316-ASPN16 | Igcbqe6twDs |
| SBS316-TD_ | onmL2dINLhk |
| SBS316-TE | SFkOtQawRKU |
| SBSCS | CI_o7_P0Ee0 |

### Images
No missing images - database already had all alt images from Neto.

### Key Finding
The Neto CSV export showed 0 videos for basket strainers, but the actual live pages had 7 videos embedded in iframes. The CSV "Youtube Video ID" field was not populated, but videos were added directly to the product pages.

## Technical Details

### Scraper Output Format
```json
{
  "scrapedAt": "2026-01-16T...",
  "products": [
    {
      "sku": "DBS3W316",
      "netoUrl": "https://...",
      "images": {
        "main": "https://www.dewaterproducts.com.au/assets/full/DBS3W316.jpg",
        "alt": [
          "https://www.dewaterproducts.com.au/assets/alt_1/DBS3W316.jpg",
          "https://www.dewaterproducts.com.au/assets/alt_2/DBS3W316.jpg"
        ]
      },
      "videos": [],
      "datasheetUrl": "https://www.dewaterproducts.com.au/assets/brochures/DBS3W316.pdf"
    }
  ]
}
```

### Dependencies
- Playwright for scraping
- Vercel Blob SDK for uploads
- Database access for comparison/insertion

## Notes

- Neto API key is expired/invalid - must use web scraping
- The Neto CSV confirms no YouTube videos exist for basket strainers
- Most datasheets already inventoried in `.planning/audit/datasheet-inventory.json`
- Priority is collecting alt images that may have been missed in initial migration
