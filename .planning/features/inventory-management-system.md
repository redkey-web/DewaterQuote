# Inventory Management System & Product Migration

**Created**: 2025-12-31
**Updated**: 2025-12-31
**Type**: Feature / System Enhancement
**Status**: Planning (Refined)
**Priority**: High

## Summary

Transform DeWater Products admin into a comprehensive B2B industrial product management platform with:
1. **Comprehensive product data** - 65 data fields for complete inventory management
2. **Multi-page admin dashboard** - Organized by frequency of use
3. **Product availability states** - Quote-only, suspended, purchaseable flags
4. **Bulk product management** - Toggle states for multiple products at once
5. **SEO consolidation** - Parent products only (variations inherit)

## Design Principles

1. **Frequency-based organization** - Daily tasks first, setup tasks last
2. **Progressive disclosure** - Essential data visible, "Show More" reveals advanced fields
3. **Engineering firm workflow** - Comprehensive data available, but not overwhelming
4. **Complete data coverage** - All business data available, organized by usage frequency
5. **Parent-child SEO** - SEO on parents, variations inherit
6. **Smart defaults** - Hide empty columns, show data only when it exists

### UX Simplicity Guidelines

Following [2025 admin dashboard best practices](https://www.uxpin.com/studio/blog/dashboard-design-principles/):
- **5-6 summary cards max** per page (inverted pyramid)
- **Essential columns first** - Advanced columns behind "Show More"
- **Visual status indicators** - Color-coded badges (🟢🟡🔴) for at-a-glance understanding
- **Contextual help** - Tooltips on column headers, links to client guide
- **Hide unused features** - If no products use a field, hide that column

---

## Admin Page Structure

```
/admin
├── Dashboard        (existing - overview stats)
├── Inventory        ⚡ NEW - Daily operations
├── Pricing          ⚡ NEW - Weekly updates
├── Products         (existing - enhanced with tabs)
├── Logistics        ⚡ NEW - Setup/quarterly
├── Categories       (existing)
├── Brands           (existing)
├── Files            (existing)
└── Settings         (existing - add SEO config)
```

---

## Phase F1: Schema Extension

### New Tables

**product_stock** - Inventory tracking (managed via admin)
```typescript
export const productStock = pgTable('product_stock', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  variationId: integer('variation_id').references(() => productVariations.id, { onDelete: 'cascade' }),
  qtyInStock: integer('qty_in_stock').default(0),
  incomingQty: integer('incoming_qty').default(0),
  preorderQty: integer('preorder_qty').default(0),
  reorderPoint: integer('reorder_point').default(5),
  expectedArrival: timestamp('expected_arrival'),
  lastUpdatedAt: timestamp('last_updated_at'),
});
```

**product_shipping** - Logistics dimensions
```typescript
export const productShipping = pgTable('product_shipping', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  variationId: integer('variation_id').references(() => productVariations.id, { onDelete: 'cascade' }),
  weightKg: decimal('weight_kg', { precision: 10, scale: 3 }),
  heightCm: decimal('height_cm', { precision: 10, scale: 2 }),
  widthCm: decimal('width_cm', { precision: 10, scale: 2 }),
  lengthCm: decimal('length_cm', { precision: 10, scale: 2 }),
  cubicM3: decimal('cubic_m3', { precision: 10, scale: 4 }),
  shippingCategory: text('shipping_category'),
  pickZone: text('pick_zone'),
  unitOfMeasure: text('unit_of_measure').default('ea'),
});
```

**product_supplier** - Supplier information
```typescript
export const productSupplier = pgTable('product_supplier', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  primarySupplier: text('primary_supplier'),
  supplierItemCode: text('supplier_item_code'),
  supplierProductName: text('supplier_product_name'),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }),
});
```

**product_seo** - SEO fields (parent products only)
```typescript
export const productSeo = pgTable('product_seo', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull().unique(),
  metaKeywords: text('meta_keywords'),
  metaDescription: text('meta_description'),
  pageTitle: text('page_title'),
});
```

### Products Table Additions

```typescript
// Add to existing products table:

// Availability controls
isQuoteOnly: boolean('is_quote_only').default(false),
isSuspended: boolean('is_suspended').default(false),
suspendedReason: text('suspended_reason'),
handlingTimeDays: integer('handling_time_days'),
leadTimeText: text('lead_time_text'),

// Pricing fields
costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
rrp: decimal('rrp', { precision: 10, scale: 2 }),
promotionPrice: decimal('promotion_price', { precision: 10, scale: 2 }),
promotionStartDate: timestamp('promotion_start_date'),
promotionEndDate: timestamp('promotion_end_date'),
promotionId: text('promotion_id'),

// Tax
taxFree: boolean('tax_free').default(false),
taxCategory: text('tax_category'),

// Price tiers (customer groups)
priceA: decimal('price_a', { precision: 10, scale: 2 }),
priceB: decimal('price_b', { precision: 10, scale: 2 }),
priceC: decimal('price_c', { precision: 10, scale: 2 }),
priceD: decimal('price_d', { precision: 10, scale: 2 }),
priceE: decimal('price_e', { precision: 10, scale: 2 }),
priceF: decimal('price_f', { precision: 10, scale: 2 }),

// Other
isVirtual: boolean('is_virtual').default(false),
isService: boolean('is_service').default(false),
customCode: text('custom_code'),
subtitle: text('subtitle'),
```

### Tasks

- [ ] Add new fields to `src/db/schema.ts`
- [ ] Create new tables (product_stock, product_shipping, product_supplier, product_seo)
- [ ] Add relations
- [ ] Run `npx drizzle-kit push`
- [ ] Update TypeScript types
- [ ] Test migrations

**Estimate**: 3-4 hours

---

## Phase F2a: Inventory Page (Daily Use)

**Route**: `/admin/inventory`
**Who uses**: Sales team, customer service
**Frequency**: Multiple times daily

### UI Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Inventory Management                                       [Refresh]│
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │ 67       │ │ 12       │ │ 8        │ │ 5        │ │ 3        │  │
│ │ Total    │ │ In Stock │ │ Low      │ │ Quote    │ │ Suspended│  │
│ │ Products │ │    🟢    │ │ Stock 🟡 │ │ Only 💬  │ │    ⏸️    │  │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│ Filter: [Status ▼] [Category ▼]  Search: [________________] 🔍     │
├─────────────────────────────────────────────────────────────────────┤
│ ☐ │ SKU      │ Name              │ Stock   │ Incoming│ Status      │
│───┼──────────┼───────────────────┼─────────┼─────────┼─────────────│
│ ☐ │ OFG-SS   │ Orbit Flex-Grip   │ 🟢 45   │ 20      │ Available   │
│ ☐ │ BFLYW316 │ Butterfly Valve   │ 🟡 3    │ 10      │ Low Stock   │
│ ☐ │ SSYS     │ Y Strainer        │ 🔴 0    │ 0       │ Out of Stock│
│ ☐ │ CF8MDAFV │ Double Acting FV  │ ⏸️ --   │ --      │ Suspended   │
│ ☐ │ FSFREJ   │ Expansion Joint   │ 💬 15   │ 5       │ Quote Only  │
├─────────────────────────────────────────────────────────────────────┤
│ Selected: 2  [Set Quote Only] [Suspend] [Activate] [Set Lead Time] │
└─────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Summary cards** - 5 status overview cards (In Stock, Low Stock, Out of Stock, Quote Only, Suspended)
2. **Stock indicators**:
   - 🟢 In Stock (qty > reorder point)
   - 🟡 Low Stock (0 < qty < reorder point)
   - 🔴 Out of Stock (qty = 0)
   - ⏸️ Suspended
   - 💬 Quote Only
3. **Bulk actions** - Toggle multiple products at once
4. **Filters** - By status, category, brand
5. **Refresh button** - Reload latest data
6. **Column toggle** - "Show More" reveals optional columns
7. **Contextual tooltips** - Hover on column headers for explanations

### Column Priority

| Priority | Columns | Always Visible |
|----------|---------|----------------|
| Essential | SKU, Name, Stock, Status | Yes |
| Important | Incoming, Arrival | Yes |
| Optional | Preorder, Reorder Point, Lead Time | Show More |

### Data Fields

| Display | Source Field | DB Field |
|---------|-------------|----------|
| Stock | Qty In Stock | qtyInStock |
| Incoming | Incoming Qty | incomingQty |
| Preorder | Preorder Qty | preorderQty |
| Arrival | Date Of Arrival | expectedArrival |
| Lead Time | Handling Time (days) | handlingTimeDays |
| Quote Only | Enquire Now | isQuoteOnly |
| Active | Active | isActive |

### Tasks

- [ ] Create `/admin/inventory/page.tsx`
- [ ] Create `InventoryTable.tsx` with DataTable
- [ ] Create `StockStatusBadge.tsx`
- [ ] Create `BulkInventoryActions.tsx`
- [ ] Create `/api/admin/inventory/route.ts` (GET, PATCH)
- [ ] Add sidebar navigation item
- [ ] Add data refresh endpoint

**Estimate**: 4-5 hours

---

## Phase F2b: Pricing Page (Weekly Use)

**Route**: `/admin/pricing`
**Who uses**: Product manager, owner
**Frequency**: Weekly price reviews

### UI Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Pricing Management                                         [Export] │
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │
│ │ Avg Margin   │ │ On Promotion │ │ Below Target │                 │
│ │    32.5%     │ │      3       │ │      8       │                 │
│ │     🟢       │ │              │ │     🔴       │                 │
│ └──────────────┘ └──────────────┘ └──────────────┘                 │
├─────────────────────────────────────────────────────────────────────┤
│ ☐ │ SKU     │ Name           │ Cost    │ RRP     │ Sell   │ Margin │
│───┼─────────┼────────────────┼─────────┼─────────┼────────┼────────│
│ ☐ │ OFG-SS  │ Flex-Grip 316  │ $32.50  │ $65.00  │ $45.50 │ 🟢 29% │
│ ☐ │ BFLYW316│ Butterfly Valve│ $280.00 │ $550.00 │ $400.00│ 🟢 30% │
│ ☐ │ SSYS    │ Y Strainer     │ $150.00 │ $300.00 │ $180.00│ 🔴 17% │
├─────────────────────────────────────────────────────────────────────┤
│ Selected: 1  [Edit Prices] [Set Promotion] [Clear Promotion]       │
└─────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Margin calculator** with color coding:
   - 🔴 Red: < 20% margin
   - 🟡 Yellow: 20-30% margin
   - 🟢 Green: > 30% margin
2. **Promotion management** - Set sale prices with dates
3. **Price tiers** - View/edit customer group pricing (A-F) *[collapsible section]*
4. **Bulk price update** - Percentage or fixed adjustments
5. **Export** - CSV for analysis
6. **Column toggle** - "Show Tier Pricing" reveals A-F columns

### Column Priority

| Priority | Columns | Always Visible |
|----------|---------|----------------|
| Essential | SKU, Name, Cost, Sell, Margin | Yes |
| Important | RRP, Promo Price | Yes |
| Optional | Promo Dates, Price A-F, Tax | Show More |

**Note:** Price tiers (A-F) only display if client uses customer groups. If not used, hide entire section.

### Data Fields

| Display | Source Field | DB Field |
|---------|-------------|----------|
| Cost | Cost Price | costPrice |
| RRP | RRP | rrp |
| Sell | Price (Default) | price (existing) |
| Promo | Promotion Price | promotionPrice |
| Promo Start | Promotion Start Date | promotionStartDate |
| Promo End | Promotion Expiry Date | promotionEndDate |
| Tier A | Price (A) | priceA |
| Tier B-F | Price (B-F) | priceB-F |
| Tax Free | Tax Free Item | taxFree |

### Tasks

- [ ] Create `/admin/pricing/page.tsx`
- [ ] Create `PricingTable.tsx` with margin calculator
- [ ] Create `MarginBadge.tsx`
- [ ] Create `PromotionForm.tsx`
- [ ] Create `/api/admin/pricing/route.ts`
- [ ] Add sidebar navigation item

**Estimate**: 3-4 hours

---

## Phase F2c: Logistics Page (Quarterly/Setup)

**Route**: `/admin/logistics`
**Who uses**: Admin, operations
**Frequency**: Initial setup, supplier changes

### UI Layout

Tabbed interface:
- **Shipping** - Dimensions, weights, freight classes
- **Suppliers** - Supplier info, purchase prices

### Data Fields

| Display | Source Field | DB Field |
|---------|-------------|----------|
| Weight | Weight (shipping) | weightKg |
| Height | Height (Shipping) | heightCm |
| Width | Width (Shipping) | widthCm |
| Length | Length (Shipping) | lengthCm |
| Volume | Cubic (Shipping) | cubicM3 |
| Freight Class | Shipping Category | shippingCategory |
| Supplier | Primary Supplier | primarySupplier |
| Supplier SKU | Supplier Item Code | supplierItemCode |
| Supplier Name | Supplier Product Name | supplierProductName |
| Unit | Selling Unit of Measure | unitOfMeasure |
| Pick Zone | Pick Zone | pickZone |

### Tasks

- [ ] Create `/admin/logistics/page.tsx`
- [ ] Create `ShippingTab.tsx`
- [ ] Create `SuppliersTab.tsx`
- [ ] Create `/api/admin/logistics/route.ts`
- [ ] Add sidebar navigation item

**Estimate**: 2-3 hours

---

## Phase F3: Frontend Availability States

### Availability Logic

```typescript
function getProductAvailability(product: Product, stock: ProductStock) {
  if (!product.isActive) return 'hidden';
  if (product.isSuspended) return 'suspended';
  if (product.isQuoteOnly) return 'quote-only';
  if (stock.qtyInStock === 0) return 'out-of-stock';
  if (stock.qtyInStock < stock.reorderPoint) return 'low-stock';
  return 'available';
}
```

### UI States

| State | Badge | Button | Price |
|-------|-------|--------|-------|
| Available | None | "Add to Cart" | Shown |
| Low Stock | "Low Stock" | "Add to Cart" | Shown |
| Out of Stock | "Out of Stock" | "Notify Me" | Shown |
| Quote Only | "Request Quote" | "Get Quote" | "POA" |
| Suspended | "Unavailable" | Disabled | Hidden |

### Tasks

- [ ] Create `ProductAvailabilityBadge.tsx`
- [ ] Update `ProductCard.tsx`
- [ ] Update product detail page
- [ ] Create `QuoteRequestForm.tsx`
- [ ] Update quote API for product quotes

**Estimate**: 4-5 hours

---

## Phase F4: Complete Data Migration

> **ONE-TIME MIGRATION**: This phase imports additional fields from the original Neto CSV export.
> After completion, all data is managed through the admin panel. No ongoing sync with Neto.

### Field Mapping (65 fields)

**Import to products table**:
- SKU, Name, Active, Price, Description (existing)
- costPrice, rrp, promotionPrice, promotionStartDate, promotionEndDate
- isQuoteOnly (from Enquire Now), handlingTimeDays, leadTimeText
- taxFree, taxCategory, priceA-F
- isVirtual, isService, customCode, subtitle

**Import to product_stock**:
- qtyInStock, incomingQty, preorderQty, expectedArrival

**Import to product_shipping**:
- weightKg, heightCm, widthCm, lengthCm, cubicM3
- shippingCategory, pickZone, unitOfMeasure

**Import to product_supplier**:
- primarySupplier, supplierItemCode, supplierProductName, purchasePrice

**Import to product_seo** (parent products only):
- metaKeywords, metaDescription, pageTitle

### Migration Script

One-time import from Neto CSV export using `scripts/import-products.ts`:

```typescript
const FIELD_MAPPING = {
  // Products table
  'Cost Price': { table: 'products', field: 'costPrice', type: 'decimal' },
  'RRP': { table: 'products', field: 'rrp', type: 'decimal' },
  'Enquire Now': { table: 'products', field: 'isQuoteOnly', type: 'boolean' },
  'Handling Time (days)': { table: 'products', field: 'handlingTimeDays', type: 'integer' },
  // ... etc

  // Stock table
  'Qty In Stock (DE Water Products)': { table: 'product_stock', field: 'qtyInStock', type: 'integer' },
  'Incoming Qty': { table: 'product_stock', field: 'incomingQty', type: 'integer' },
  // ... etc
};
```

### Tasks

- [ ] Update `import-products.ts` with all 65 fields
- [ ] Add upsert logic for new tables
- [ ] Add SEO parent-only logic
- [ ] Create import log for verification
- [ ] Run one-time import from Neto CSV
- [ ] Verify data in admin panel

**Estimate**: 3-4 hours

> **After this phase:** Admin panel becomes the sole interface for product management.
> No further imports from Neto needed.

---

## Phase F5: Product Migration

Unchanged from original plan - migrate remaining 1,069 products.

**Estimate**: 4-6 hours + review time

---

## Phase F6: Backup & Export System

**Goal**: Data protection and client self-service exports

### Backup Layers

| Layer | What | Protection Against |
|-------|------|---------------------|
| **Neon PITR** | Point-in-time recovery (7-30 days) | Accidental deletes, bad updates |
| **S3 Backups** | Nightly pg_dump to external storage | Neon outage, account issues |
| **Admin Exports** | CSV downloads per page | Client self-service, analysis |
| **CSV Exports** | Admin export functionality | Self-service data backups |

### F6a: Admin Export Buttons

Add export functionality to each admin page:

| Page | Export Button | Contents |
|------|---------------|----------|
| Inventory | [Export CSV] | SKU, Name, Stock, Incoming, Status |
| Pricing | [Export CSV] | SKU, Cost, RRP, Sell, Margin% |
| Products | [Export CSV] | Full product data with variations |
| Logistics | [Export CSV] | Dimensions, weights, supplier info |
| Settings | [Full Backup] | Complete database (JSON or SQL) |

**API Endpoint**: `/api/admin/export/[type]/route.ts`

```typescript
// Types: inventory, pricing, products, logistics, full
export async function GET(request: Request, { params }) {
  // 1. Verify admin session
  // 2. Query relevant data
  // 3. Format as CSV
  // 4. Return with download headers
  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="dewater-${type}-${date}.csv"`
    }
  });
}
```

### F6b: Automated S3 Backups

GitHub Action for nightly database backups:

```yaml
# .github/workflows/backup.yml
name: Database Backup

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:      # Manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    env:
      RETENTION: 30  # Days to keep backups
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      S3_BUCKET: ${{ secrets.S3_BUCKET }}

    steps:
      - name: Install PostgreSQL
        run: sudo apt install -y postgresql-16

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-2

      - name: Run pg_dump
        run: |
          BACKUP_FILE="dewater-$(date +'%Y-%m-%d').sql.gz"
          pg_dump $DATABASE_URL | gzip > $BACKUP_FILE

      - name: Upload to S3
        run: aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/backups/

      - name: Delete old backups
        run: |
          CUTOFF=$(date -d "-$RETENTION days" +%Y-%m-%dT%H:%M:%SZ)
          aws s3api list-objects --bucket $S3_BUCKET --prefix "backups/" \
            --query "Contents[?LastModified<'${CUTOFF}'].Key" --output text | \
            xargs -I {} aws s3 rm s3://$S3_BUCKET/{}
```

### F6c: Neon Configuration

Verify/configure in Neon dashboard:
- [ ] Restore window set to 7+ days
- [ ] Understand PITR process
- [ ] Document recovery procedure

### Tasks

- [ ] Create `/api/admin/export/[type]/route.ts`
- [ ] Add Export button to Inventory page
- [ ] Add Export button to Pricing page
- [ ] Add Export button to Products page
- [ ] Add Export button to Logistics page
- [ ] Add Full Backup to Settings page
- [ ] Create GitHub Action backup workflow
- [ ] Set up S3 bucket (or use Vercel Blob)
- [ ] Add secrets to GitHub repository
- [ ] Update client guide with backup info
- [ ] Test restore procedure

**Estimate**: 6-8 hours

---

## Fields Not Included

The following fields are not applicable to this project:

| Field | Reason |
|-------|--------|
| Kit Components | Not using product kits |
| Editable Kits | Not using product kits |
| eBay ePIDs | Not selling on eBay |

See **Client Guide** for detailed explanation: `docs/client-admin-guide.md`

---

## Implementation Order

| Phase | Description | Hours | Dependencies |
|-------|-------------|-------|--------------|
| F1 | Schema Extension | 3-4 | None |
| F4 | Complete Migration | 3-4 | F1 |
| F2a | Inventory Page | 4-5 | F1 |
| F2b | Pricing Page | 3-4 | F1 |
| F2c | Logistics Page | 2-3 | F1 |
| F3 | Frontend States | 4-5 | F1 |
| F5 | Migration | 4-6 | F1, F4 |
| F6 | Backup & Export | 6-8 | F2a-c |

**Total**: ~30-39 hours

### Recommended Sessions

1. **Session 1** (4-5 hrs): F1 + F4 (Schema + Migration)
2. **Session 2** (4-5 hrs): F2a (Inventory Page)
3. **Session 3** (5-7 hrs): F2b + F2c (Pricing + Logistics)
4. **Session 4** (4-5 hrs): F3 (Frontend States)
5. **Session 5** (4-6 hrs): F5 (Migration)
6. **Session 6** (6-8 hrs): F6 (Backup & Export)

---

## Best Practices Alignment

**Analysis Date**: 2025-12-31
**Rating**: 8.5/10 - Good alignment with B2B industrial best practices

### Alignment Summary

| Best Practice | Status | Notes |
|---------------|--------|-------|
| Frequency-based organization | ✅ Excellent | Daily → Weekly → Monthly → Quarterly |
| Progressive disclosure | ✅ Good | Essential columns visible, "Show More" for advanced |
| SKU visibility & status | ✅ Very Good | 5 status cards, color-coded badges |
| Buffer stock management | ✅ Good | Reorder points, incoming qty, expected arrival |
| Single source of truth | ✅ Excellent | Database + admin panel, 65 fields |
| Export capability | ✅ Excellent | Per-page CSV + full backup |
| Multi-layer backup | ✅ Excellent | Neon PITR + S3 + exports |
| Simple UI | ✅ Good | 5-6 cards max, clean layout |

### Sources Consulted

- [Supply Chain Dive - 4 Strategies for 2025](https://www.supplychaindive.com/news/4-inventory-management-supply-chain-operations-best-practices/743461/)
- [UXPin Dashboard Design Principles](https://www.uxpin.com/studio/blog/dashboard-design-principles/)
- [B2B Inventory Management - AAJ Enterprises](https://www.aajenterprises.com/b2b-inventory-management/)
- [Kerridge PVF Distribution Software](https://www.kerridgecs.com/en-us/distribution/pipe-valves-and-fittings-software)

---

## Related Documents

- [[product-price-audit.md]] - Phase A-E (SKU/price sync) - COMPLETE
- `docs/client-admin-guide.md` - Client-facing documentation
- [[site-audit.md]] - Functionality testing
