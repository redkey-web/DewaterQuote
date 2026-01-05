# Neto Content Sync

**Created**: 2026-01-05
**Updated**: 2026-01-05
**Type**: Data Migration / Content Sync
**Status**: In Progress

## Summary

Ensure all content from the old Neto site is captured in the new site's database, including:
1. **Datasheets/PDFs** - ✅ 53 datasheets now linked in database
2. **Product Content** - Descriptions, bullet points, and other content from 149 Neto products

## Current State

### PDFs/Datasheets ✅ COMPLETE
- Scanned production site for PDFs at `/assets/brochures/{SKU}.pdf`
- Found **76 datasheets** on production site
- Matched **47 to existing products** in database
- **53 total downloads** now in `product_downloads` table
- 27 datasheets are for products not yet in DB (mostly Teekay/Straub)

**Scripts created:**
- `scripts/scan-datasheets.ts` - Scans production site for PDFs
- `scripts/sync-datasheets-to-db.ts` - Links PDFs to database products

**Inventory saved:** `.planning/audit/datasheet-inventory.json`

### Product Content
- Neto CSV: 149 parent products, 1,486 total variations
- Database: 133 products (from previous imports)
- Content in Neto CSV:
  - **Description**: Only 7% filled (115 products)
  - **Short Description**: 81% filled (1,325 rows)
  - **Bullet points**: 85.5% filled (1,398 rows)
  - **SEO Meta Description**: 9.7% filled (158 rows)
  - **SEO Meta Keywords**: 9.5% filled (156 rows)

## Phases

### Phase 1: Datasheet Audit & Collection ✅ COMPLETE
- [x] Create script to scan production site for PDF links
- [x] Create inventory of which products have datasheets (76 found, 47 matched)
- [x] Update `product_downloads` table with datasheet URLs (53 downloads synced)
- [~] Download/upload to Vercel Blob - NOT NEEDED, PDFs hosted on production site

### Phase 2: Display Datasheets on Product Pages ✅ COMPLETE
- [x] Verify ProductDetailClient.tsx shows downloads (lines 702-714)
- [x] Ensure all products with datasheets have them linked in DB (47 matched)
- [~] Visual indicator for products without datasheets - NOT NEEDED
- [x] Test download functionality - Links open production site PDFs in new tab

### Phase 3: Content Gap Analysis
- [ ] Create script to compare Neto CSV products vs database products
- [ ] Identify products in Neto but missing from DB
- [ ] Identify products with richer content in Neto vs catalog.ts

### Phase 4: Content Sync Script
- [ ] Create `scripts/sync-neto-content.ts` to:
  - Parse Neto CSV
  - Update product descriptions where richer content exists
  - Sync bullet points to `product_features` table
  - Sync short descriptions if useful
  - Update SEO fields in `product_seo` table
- [ ] Run sync in dry-run mode first
- [ ] Review changes, then apply

### Phase 5: Missing Products
- [ ] Identify products in Neto not yet in database
- [ ] Determine if they should be added (some may be discontinued)
- [ ] Add missing active products via admin or script

### Phase 6: Verification
- [ ] Run build to verify all pages render
- [ ] Spot check 10 products for correct content
- [ ] Verify datasheets download correctly
- [ ] Check SEO meta tags render properly

## Dependencies

- Access to old Neto site assets (may need to scrape before site is decommissioned)
- Neto export CSV: `.planning/audit/neto-export.csv`
- Existing sync scripts in `/scripts/`

## Notes

- The Neto site appears to be still running at dewaterproducts.neto.com.au but returned connection errors - may be protected or down
- Priority should be extracting PDFs before Neto is fully decommissioned
- Content descriptions in Neto are sparse (only 7% filled) - may not provide much value
- Bullet points are well-populated and should be synced to features table

## Technical Details

### Database Tables Involved
- `products` - description, seo fields
- `product_downloads` - PDF/datasheet links
- `product_features` - bullet points
- `product_seo` - meta keywords, meta description, page title

### Existing Scripts
- `scripts/sync-catalog-to-db.ts` - syncs catalog.ts to DB
- `scripts/sync-from-neto-csv.ts` - may already handle some of this
- `scripts/import-neto.ts` - imports via Neto API (requires live connection)
