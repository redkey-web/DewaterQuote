# Datasheet Migration & Verification

**Created**: 2026-01-21
**Type**: feature
**Status**: In Progress

## Summary

Audit all product datasheets across the database, local files, and external sources. Verify accessibility on the live site and migrate any missing/broken datasheets to Vercel Blob storage. The old Neto site (dewaterproducts.com.au/assets/brochures/) appears to have been decommissioned - PDFs that were accessible on Jan 5 are now returning 404.

## Scope

- **Impact**: High - affects product pages and customer experience
- **Files**: ~51 download records in database
- **Products**: 149+ products may need datasheet verification

## Current State

### Wayback Recovery (2026-01-21)
- **Total archived PDFs found**: 99
- **Successfully recovered**: 94
- **Failed (not on Wayback)**: 5
- **Recovery script**: `scripts/recover-datasheets-wayback.ts`
- **Results file**: `.planning/audit/wayback-recovery-2026-01-21.json`

### Failed Files (Need Manual Sourcing)
1. FlexGrip2PLong.pdf
2. FVHDPE.pdf
3. OCCL.pdf
4. OCFG-S.pdf
5. TKAFIV.pdf

### Known Storage Locations
1. **Old Neto site**: `https://www.dewaterproducts.com.au/assets/brochures/*.pdf` (DECOMMISSIONED - all 404)
2. **Vercel Blob**: `https://9sedkgbytyvyjils.public.blob.vercel-storage.com/downloads/brochures/` (94 PDFs migrated)
3. **Local files**: None found in `/public/assets/brochures/`

### Database Table
- `product_downloads` table stores PDF links per product
- URLs updated to Vercel Blob for all recovered files

---

## Phases

### Phase 1: Fresh Audit ✅ COMPLETE
- [x] Create script to re-check ALL download URLs in database
- [x] Check old Neto URLs for current accessibility (all 404)
- [x] Check Vercel Blob URLs for accessibility
- [x] Generate report: accessible vs broken links
- [x] Save audit results to `.planning/audit/wayback-recovery-2026-01-21.json`

### Phase 2: Source Identification ✅ COMPLETE
- [x] Check Wayback Machine for archived copies of missing PDFs (99 found)
- [ ] Check if client has local backup of Neto `/assets/brochures/` folder
- [ ] Identify manufacturer sources for each brand's datasheets:
  - Orbit Couplings
  - Straub Couplings
  - Teekay Couplings
  - Bore-Flex (expansion joints)
  - Generic valves/strainers
- [x] Create list of PDFs that can be recovered vs need recreation (5 need sourcing)

### Phase 3: Migration to Vercel Blob ✅ COMPLETE
- [x] Download all accessible PDFs from old Neto site (none remain)
- [x] Download archived copies from Wayback Machine (94 successful)
- [x] Upload all recovered PDFs to Vercel Blob storage
- [x] Organize in folder structure: `/downloads/brochures/{sku}.pdf`
- [x] Update `product_downloads` table with new Vercel Blob URLs

### Phase 4: Missing PDF Resolution 🔄 IN PROGRESS
- [x] List all products with missing datasheets (5 files identified)
- [ ] Contact manufacturers for official datasheets
- [ ] Option: Create simple spec sheets from product database info
- [ ] Option: Mark products as "Datasheet unavailable" temporarily
- [ ] Document which products need datasheets created/sourced

### Phase 5: Verification & Cleanup
- [ ] Re-run audit to confirm all links working
- [ ] Test datasheet downloads on live product pages
- [ ] Remove any orphaned download records
- [ ] Update `.planning/audit/datasheet-inventory.json` with final state

---

## Technical Details

### Script Requirements
```typescript
// Audit script needs:
// 1. Fetch all product_downloads from DB
// 2. HEAD request each URL to check status
// 3. Categorize: vercel_blob | neto_live | neto_dead | wayback_available
// 4. Output JSON report
```

### Vercel Blob Upload
```typescript
// Upload pattern:
// POST /api/upload with file + folder param
// Folder structure: downloads/{brand}/{sku}.pdf
```

### Database Update
```sql
-- Update download URLs
UPDATE product_downloads
SET url = 'https://....blob.vercel-storage.com/downloads/...'
WHERE url LIKE '%dewaterproducts.com.au/assets/brochures%';
```

---

## Dependencies

- Vercel Blob storage (already configured)
- Wayback Machine API access (cdx.archive.org)
- Client confirmation on priority/missing PDFs

## Notes

- Previous audit file: `.planning/audit/datasheet-inventory.json`
- Some size-specific SKUs (e.g., `OCOF400-L1000.0`) will share parent product datasheet
- FSF-BREJ.pdf was confirmed accessible on Jan 5 but now 404 - suggests recent Neto shutdown
