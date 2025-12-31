# Product & Price Audit System

**Created**: 2025-12-30
**Updated**: 2025-12-31
**Type**: System / Data Integrity
**Status**: In Progress
**Priority**: High

## Summary

**CONTEXT**: Database-first architecture. Neto is the import source, Database is the runtime source.

**Current Architecture** (as of 2025-12-31):
1. **Neto Store** - SOURCE for importing products/prices (1328 products, 74 families)
2. **Neon Database** - **SOLE RUNTIME SOURCE** for all product data (404 variations)
3. **catalog.ts** - BUILD-TIME ONLY (generateStaticParams, client-side suggestions) - NOT used for display
4. **Vercel Blob** - Product images (CDN-cached, 1-year browser cache)

**Data Flow**:
- Neto → Database (import/sync) → Website (runtime)
- No fallbacks: if DB fails, site shows errors (intentional - no silent degradation)

**Goal**: Ensure migrated products are COMPLETE and ACCURATE before adding more.

**Related**: [[site-audit.md]] - Functionality testing (links, pages, UI)

---

## Key Decisions (2025-12-30)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **SKU Format** | Match Neto EXACTLY | Single source of truth, no mapping needed |
| **Size Coverage** | ALL sizes from Neto | Complete product offerings |
| **Priority** | Fix first, then add | Ensure quality before expanding |
| **Architecture** | Database-only (no fallbacks) | Clear error visibility, single source |

**Implications:**
- Database is THE source for all runtime product data
- Sync scripts import from Neto → Database directly
- catalog.ts only used for build-time static generation (not runtime)

---

## Audit Results (2025-12-30)

### Summary
| Source | Count |
|--------|-------|
| Neto active products | 1,328 |
| Neto product families | 74 |
| catalog.ts products | 12 (100 variations) |
| Database variations | 404 |

### Findings
| Issue | Count | Status |
|-------|-------|--------|
| Price mismatches | 0 | ✅ Fixed |
| SKU format mismatches | 41 | 🔧 **Decision: Update to match Neto** |
| Missing sizes (migrated products) | 117 | 🔧 **Decision: Add ALL sizes** |
| Products not yet migrated | 1,069 | 📋 Phase 2 (after fixes) |

### SKU Format Changes Required
Update our SKUs to match Neto exactly:
| Our Current SKU | Neto SKU | Action |
|-----------------|----------|--------|
| `PTFELBFLYW-50` | `PTFELBFLY_50` | Rename |
| `FSFREJ-50` | `FSFREJ50` | Rename |
| `CF8MWEBFVL-50` | `CF8MWEBFVL_50` | Rename |
| (and 38 more) | | |

### Missing Sizes by Product (Migrated but Incomplete)
| Product | Missing Sizes | Notes |
|---------|---------------|-------|
| OCFG-S | 47 | Straub couplings - many pipe sizes |
| DB-1 | 31 | Duckbill - OD pipe sizes |
| FSFREJ | 16 | Rubber expansion joint |
| FVGALV | 12 | Galv foot valve |
| PTFELBFLYW | 5 | PTFE butterfly (SKU mismatch) |
| OCRC55 | 4 | Straub clamp |
| CF8MWEBFVL | 1 | Butterfly valve |
| OCFG-L | 1 | Straub coupling large |

## Data Sources

### Source 1: Neon Database (RUNTIME SOURCE)
- Tables: `products`, `product_variations`, `product_images`, etc.
- Populated by: `scripts/seed.ts`, `scripts/sync-catalog-to-db.ts`
- Fields: sku, price, product_id, size, attributes
- Queried via: `src/lib/db/products.ts`
- **THIS IS THE ONLY SOURCE FOR RUNTIME DATA**

### Source 2: Neto Store (IMPORT SOURCE)
- Endpoint: `https://www.dewaterproducts.com.au/do/WS/NetoAPI`
- Auth: NETOAPI_KEY header only
- Action: GetItem
- Returns: SKU, Name, DefaultPrice, ParentSKU, IsActive
- Total products: ~1328 items
- **Used for syncing prices/products TO database**

### Source 3: catalog.ts (BUILD-TIME ONLY)
- Location: `src/data/catalog.ts`
- Contains: Product definitions with sizeOptions arrays
- **NO LONGER USED FOR RUNTIME DISPLAY** (as of 2025-12-31)
- Only used for: generateStaticParams (build-time), OrderBumps (client-side suggestions)
- Historical: Was used as fallback before database-first architecture

---

## Phase A: Code Audit ✅ COMPLETE
**Goal**: Map all price/product fields in codebase

> **Note (2025-12-31)**: This phase was completed before the architecture change.
> catalog.ts fallbacks have since been removed. Database is now the sole runtime source.

### A1. Extract catalog.ts products
- [x] Parse catalog.ts programmatically
- [x] Extract all products with: id, sku, name, category
- [x] Extract all sizeOptions with: value, label, price, sku
- [x] Found: 12 products, 100 variations

### A2. Query database products
- [x] Query all products with variations
- [x] Map: product_id -> sku -> price -> size
- [x] Found: 404 variations in database

### A3. Map data flow
- [x] ~~Document: catalog.ts -> seed.ts -> database~~ (obsolete)
- [x] Document: database -> products.ts -> pages
- [x] **Updated (2025-12-31)**: Now just Database → Pages (no fallback)

### A4. Find hardcoded prices
- [x] Prices only in catalog.ts sizeOptions
- [x] No hardcoded prices in components
- [x] **Updated (2025-12-31)**: All prices now from database only

### A5. Generate Code Audit Report
- [x] Created `scripts/full-audit.ts`
- [x] Output: `.planning/audit/audit-results.json`

---

## Phase B: Neto Data Extraction (CSV Export) ✅ COMPLETE
**Goal**: Get complete product catalog from Neto via CSV export (bypasses API restrictions)

### B1. Export CSV from Neto Control Panel
- [x] Login to Neto control panel
- [x] Navigate: Settings & tools → Export Data → Products
- [x] Click "Perform simple export" → "CSV file with all fields"
- [x] Downloaded: `.planning/audit/neto-export.csv` (2800+ rows)

### B2. Create CSV parser script
- [x] Integrated into `scripts/full-audit.ts`
- [x] Parse all product fields from CSV
- [x] Build parent-child SKU relationships
- [x] Found: 1,328 active products, 84 families

### B3. Analyze Neto structure
- [x] Group products by ParentSKU
- [x] Identify 84 product families
- [x] Map size variations to parent SKUs
- [x] Output: `.planning/audit/product-families.md`

### B4. Generate Neto catalog report
- [x] Total: 1,328 products in 84 families
- [x] Categorized by: Valves, Strainers, Expansion Joints, Clamps, etc.
- [x] Price ranges documented per family

---

## Phase C: Cross-Check & Reconciliation ✅ COMPLETE
**Goal**: Compare all sources, identify discrepancies

### C1. Product existence check
- [x] 1,069 products in Neto but not in catalog.ts (expected - not yet migrated)
- [x] 41 SKUs in catalog.ts but not in Neto (SKU format mismatch)
- [x] 404 variations in database (imported separately)

### C2. SKU format comparison
- [x] Identified 41 SKU format mismatches
- [x] Patterns documented (dash vs underscore, etc.)
- [x] **Decision: Match Neto SKUs exactly**

### C3. Price comparison (per-SKU)
- [x] 0 price mismatches found ✅
- [x] Earlier fixes (BFLYW316, BFLYLE316, PTFELBFLYW, SSYS) successful

### C4. Size options comparison
- [x] 117 missing sizes identified across 8 products
- [x] Detailed by product in audit results
- [x] **Decision: Add ALL sizes from Neto**

### C5. Generate Discrepancy Report
- [x] Output: `.planning/audit/audit-results.json`
- [x] Output: `.planning/audit/product-families.md`
- [x] Summary: 0 price issues, 41 SKU issues, 117 missing sizes

---

## Phase D: Playwright Verification
**Goal**: Verify displayed prices match API/expected

### D1. Create headless Playwright script
- [ ] Use browser.launch({ headless: true })
- [ ] Navigate to product pages
- [ ] Extract size dropdown options
- [ ] Capture displayed prices
- [ ] Compare to Neto API values

### D2. Spot-check sample products
- [ ] Test 5-10 products across categories
- [ ] Verify price updates after size selection
- [ ] Check for GST/display differences
- [ ] Document any frontend calculation issues

### D3. Verify our staging site
- [ ] Compare staging prices to expected
- [ ] Verify ISR cache is refreshing
- [ ] Test database-driven prices
- [ ] Output: `/.planning/audit/playwright-results.json`

### D4. Generate Verification Report
- [ ] Sites tested
- [ ] Products verified
- [ ] Any discrepancies found
- [ ] Cache/timing observations

---

## Phase E: Reconciliation Scripts 🔄 IN PROGRESS
**Goal**: Fix issues for MIGRATED products and prevent future drift

> **Updated (2025-12-31)**: Sync now goes Neto → Database directly (no catalog.ts step)

### E1. SKU standardization
- [x] **Decision: Match Neto SKUs exactly**
- [x] ~~Update catalog.ts SKUs~~ (not needed - catalog.ts not used for runtime)
- [ ] Update database SKUs to match Neto format
- [ ] Products needing SKU changes: PTFELBFLYW, FSFREJ, CF8MWEBFVL, others

### E2. Add ALL missing sizes to migrated products (DATABASE)
- [ ] SSYS: Add 7 sizes (65mm, 125mm, 350-600mm) - $1,214 to $40,635
- [ ] OCFG-S: Add 47 sizes (all pipe diameters)
- [ ] DB-1: Add 31 sizes (all OD sizes)
- [ ] FSFREJ: Add 16 sizes
- [ ] FVGALV: Add 12 sizes
- [ ] PTFELBFLYW: Add 5 sizes (fix SKU format)
- [ ] OCRC55: Add 4 sizes
- [ ] CF8MWEBFVL: Add 1 size
- [ ] OCFG-L: Add 1 size

### E3. Price sync script (Neto → Database)
- [x] neto-price-check.ts with --fix flag
- [ ] Update to sync Neto → Database directly (bypass catalog.ts)
- [x] ~~Add catalog.ts auto-update~~ (not needed - DB is source)

### E4. Ongoing sync script
- [ ] Schedule-able price check (cron or manual)
- [ ] Compare Neto prices against Database
- [ ] Update Database directly from Neto export
- [ ] Alert on price drift > threshold

---

## Phase F: Category Strategy (Post-Migration)
**Goal**: Plan category structure for remaining products

### F1. Review Neto product families
- [ ] List all 74 product families in Neto
- [ ] Group by category (Valves, Strainers, Expansion Joints, etc.)
- [ ] Identify high-priority products for migration

### F2. Design category structure
- [ ] Current categories in new site
- [ ] Proposed streamlined categories
- [ ] Map Neto categories → new categories

### F3. Migration roadmap
- [ ] Phase 1: Complete current 12 products (missing sizes)
- [ ] Phase 2: High-demand products
- [ ] Phase 3: Remaining products
- [ ] Estimate: products per phase

### F4. Category decision document
- [ ] Create `.planning/audit/category-strategy.md`
- [ ] Document decisions and rationale
- [ ] Get stakeholder approval

---

## Deliverables

### Scripts
| File | Purpose | Status |
|------|---------|--------|
| `scripts/full-audit.ts` | Complete audit (CSV + DB comparison) | ✅ Done |
| `scripts/neto-price-check.ts` | Price comparison & fix (Neto → DB) | ✅ Done |
| `scripts/find-strainers.ts` | Search Neto products | ✅ Done |
| `scripts/check-prices.ts` | Verify DB prices vs source | ✅ Done |
| `scripts/fix-sku-format.ts` | Update Database SKUs to match Neto | 📋 Needed |
| `scripts/add-missing-sizes.ts` | Add all sizes to Database | 📋 Needed |
| `scripts/playwright-verify.ts` | Headless price verification | 📋 Phase D |

### Reports
| File | Purpose | Status |
|------|---------|--------|
| `.planning/audit/neto-export.csv` | Raw CSV export from Neto | ✅ Done |
| `.planning/audit/audit-results.json` | Full audit results | ✅ Done |
| `.planning/audit/product-families.md` | 84 families overview | ✅ Done |

---

## Technical Notes

### Neto CSV Export (Primary Method)
```
Steps:
1. Login: https://www.dewaterproducts.com.au/cpanel/
2. Navigate: Settings & tools → Export Data
3. Select: Products
4. Click: "Perform simple export"
5. Choose: "CSV file with all fields"
6. Download and save to: .planning/audit/neto-export.csv
```

Expected CSV fields include: SKU, ParentSKU, Name, DefaultPrice, RRP, CostPrice,
PromotionPrice, Categories, Brand, Model, IsActive, WarehouseQuantity, and 90+ more.

### Neto API Details (For Incremental Sync)
```typescript
// Working request structure - use for ongoing sync, not full audit
fetch('https://www.dewaterproducts.com.au/do/WS/NetoAPI', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'NETOAPI_ACTION': 'GetItem',
    'NETOAPI_KEY': process.env.NETO_API_KEY
  },
  body: JSON.stringify({
    Filter: {
      IsActive: [true],
      DateUpdatedFrom: '2025-12-30 00:00:00', // For incremental sync
      Page: page,
      Limit: 100,
      OutputSelector: ['SKU', 'Name', 'DefaultPrice', 'ParentSKU', 'IsActive', 'DateUpdated']
    }
  })
});
```

### Database Schema (Neon PostgreSQL)

**This is THE source for all runtime product data.**

```sql
-- products table (67+ products)
id, sku, name, slug, description, category_id, subcategory_id, brand_id,
materials, pressure_range, temperature, size_from, lead_time, price_varies, is_active

-- product_variations table (404+ variations)
id, product_id, sku, price, size, label, source, display_order

-- product_images table (Vercel Blob URLs)
id, product_id, url, alt, type, is_primary, display_order

-- product_features, product_specifications, product_applications, product_downloads
```

See `CLAUDE.md` for full schema documentation.

### SKU Patterns Observed
- Parent: SSYS, BFLYW316, etc.
- Child: SSYS-50, SSYS-65, BFLYW316-100, etc.
- Size suffix: -50, -65, -80, -100, -125, -150, -200, -250, -300, -350, -400, -450, -500, -600

### Known Issues Found
1. SSYS missing 7 sizes: 65mm, 125mm, 350mm, 400mm, 450mm, 500mm, 600mm
2. Multiple butterfly valves had incorrect prices (fixed)
3. 79 SKUs not found in Neto (may be different format or manual additions)

### Architecture Changes (2025-12-31)
- ✅ Removed catalog.ts fallback from `src/data/products.ts`
- ✅ Removed catalog.ts fallback from `src/lib/db/products.ts`
- ✅ Removed catalog.ts fallback from `src/lib/db/categories.ts`
- ✅ Database errors now throw (no silent fallback)
- ✅ Vercel Blob images with 1-year cache

---

## Execution Order

1. **Phase A** (Code Audit) - Understand our current state
2. **Phase B** (Neto Extract) - Get source of truth
3. **Phase C** (Cross-Check) - Find all discrepancies
4. **Phase D** (Playwright) - Verify live site matches
5. **Phase E** (Scripts) - Tools to fix and maintain

Estimated effort: ~3-4 hours total

---

## Research Findings (2025-12-30)

### Existing Solutions Evaluated

| Solution | What It Does | Verdict |
|----------|--------------|---------|
| [neto-export](https://github.com/lumberjack-so/neto-export) | Supabase Edge Functions sync Neto→Postgres | Good patterns, but full sync not comparison |
| [neto-api-node](https://github.com/matt-downs/neto-api-node) | Promise-based Node.js client | Nice but unnecessary, raw fetch works |
| [API2Cart](https://api2cart.com/neto-ecommerce-integration/) | Paid unified ecommerce API | Overkill for single-store |
| Official Neto Export | CSV export templates, 15min intervals | Manual, not programmatic comparison |

### Key Finding: No Price Webhooks

**Neto does NOT have webhooks for price changes.** Only order status webhooks exist.
This means our polling/comparison approach is the CORRECT solution.

Sources:
- [Neto Webhooks Docs](https://developers.maropost.com/documentation/engineers/api-documentation/notification-events-webhooks) - Order notifications only
- [Maropost Community](https://galaxy.maropost.com) - Users report sync issues with no native solution

### API Enhancement Opportunity

**GetItem supports 102 OutputSelector fields!** We're only using 5.

Current fields:
```
SKU, Name, DefaultPrice, ParentSKU, IsActive
```

Should add:
```
RRP, CostPrice, PromotionPrice, PromotionStartDate, PromotionExpiryDate,
PriceGroups, Categories, ItemSpecifics, DateUpdated, WarehouseQuantity,
Approved, Visible, Images, ProductURL
```

### Incremental Sync Capability

Use `DateUpdatedFrom` filter for efficient sync:
```typescript
Filter: {
  DateUpdatedFrom: '2025-12-01 00:00:00',
  IsActive: [true],
  // ... rest of filter
}
```
This fetches only changed products instead of all 1328.

### Price Groups Discovery

Neto supports [multilevel pricing](https://galaxy.maropost.com/kb/articles/1552-multilevel-pricing) (trade, wholesale, retail).
We should check if products have different price tiers.

### Reference Implementation

The [neto-export](https://github.com/lumberjack-so/neto-export) project demonstrates:
- Pagination handling (500-1000 records/page)
- Error resilience
- MySQL→Postgres date conversion
- Deduplication patterns

We can adapt these patterns for our audit scripts.

### Conclusion

**Our audit approach is validated.** No off-the-shelf solution exists for price comparison.
We're building the right thing. Enhancements identified:
1. Expand API field extraction
2. Add incremental sync with DateUpdatedFrom
3. Check for price groups/multilevel pricing
4. Package scripts for reuse

### Sources

- [Neto GetItem API Docs](https://developers.maropost.com/documentation/engineers/api-documentation/products/getitem)
- [Neto Products API Overview](https://developers.maropost.com/documentation/engineers/api-documentation/products)
- [neto-export GitHub](https://github.com/lumberjack-so/neto-export)
- [neto-api-node GitHub](https://github.com/matt-downs/neto-api-node)
- [Maropost Developer Portal](https://developers.maropost.com/)
