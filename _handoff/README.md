# Handoff Protocol: Replit AI → Claude Code

This directory enables Replit AI to prepare database and blob operations that Claude Code will execute.

## Why This Exists

Replit AI cannot:
- Access `DATABASE_URL` (production database)
- Access `BLOB_READ_WRITE_TOKEN` (Vercel Blob storage)
- Run `npx tsx scripts/*.ts`
- Execute Drizzle migrations

Claude Code CAN do all of these. This handoff system bridges the gap.

## Directory Structure

```
_handoff/
├── README.md          # This file
├── pending/           # Requests awaiting processing
│   └── *.json         # One file per request
└── completed/         # Processed requests (for audit trail)
    └── *.json         # Moved here after completion
```

## How It Works

### Replit AI (Creator)

1. Create JSON file in `pending/`
2. Name: `{YYYY-MM-DD}-{short-description}.json`
3. Fill in the operation details
4. Commit and push to main

### Claude Code (Executor)

1. Check `pending/` for new requests
2. Validate the request
3. Execute the operation
4. Add result to the JSON
5. Move to `completed/`
6. Commit and push

## Request Format

```json
{
  "operation": "create_product | update_product | update_prices | delete_product | upload_images | run_script | custom",
  "priority": "urgent | normal | low",
  "data": {
    // Operation-specific data
  },
  "notes": "Human-readable context for Claude",
  "createdBy": "replit-ai",
  "createdAt": "2025-01-01T10:00:00Z",

  // Added by Claude after processing:
  "status": "completed | failed | partial",
  "result": { ... },
  "processedBy": "claude-code",
  "processedAt": "2025-01-01T12:00:00Z"
}
```

## Operation Types

### create_product

Create a new product with all related data.

```json
{
  "operation": "create_product",
  "data": {
    "name": "Product Name",
    "shortName": "Short Name",
    "slug": "product-slug",
    "sku": "PRD-001",
    "brandId": 1,
    "categoryId": 2,
    "subcategoryId": null,
    "description": "Full product description...",
    "materials": { "body": "316 Stainless Steel" },
    "pressureRange": "PN16",
    "temperature": "-20°C to +110°C",
    "sizeFrom": "DN50 to DN300",
    "leadTime": "In Stock",
    "priceVaries": true,
    "features": [
      "Feature 1",
      "Feature 2"
    ],
    "specifications": [
      { "label": "Body Material", "value": "316SS (CF8M)" }
    ],
    "applications": [
      "Water treatment",
      "Mining"
    ],
    "variations": [
      { "size": "50mm", "label": "DN50", "price": "125.00", "sku": "PRD-001-50" }
    ],
    "images": [
      { "url": "https://...blob.../image.jpg", "alt": "Product image", "isPrimary": true }
    ]
  },
  "notes": "New product for Q1 2025 catalog"
}
```

### update_product

Update existing product fields.

```json
{
  "operation": "update_product",
  "data": {
    "identifier": { "sku": "OFG-SS" },
    "updates": {
      "description": "Updated description...",
      "leadTime": "2-3 weeks"
    }
  }
}
```

### update_prices

Bulk price updates for a product's variations.

```json
{
  "operation": "update_prices",
  "data": {
    "productSku": "OFG-SS",
    "variations": [
      { "size": "48.3mm", "newPrice": "49.95" },
      { "size": "60.3mm", "newPrice": "55.00" }
    ]
  }
}
```

### add_variations

Add new size variations to existing product.

```json
{
  "operation": "add_variations",
  "data": {
    "productSku": "OFG-SS",
    "variations": [
      { "size": "200mm", "label": "DN200", "price": "185.00" }
    ]
  }
}
```

### upload_images

Request image upload to Blob storage.

```json
{
  "operation": "upload_images",
  "data": {
    "productSku": "OFG-SS",
    "images": [
      {
        "sourcePath": "public/images/products/new-image.jpg",
        "alt": "Product alternate view",
        "isPrimary": false
      }
    ]
  },
  "notes": "New product photos from client"
}
```

### run_script

Execute a predefined script.

```json
{
  "operation": "run_script",
  "data": {
    "script": "sync-catalog-to-db",
    "args": []
  }
}
```

### deactivate_product

Soft-delete a product (set isActive=false).

```json
{
  "operation": "deactivate_product",
  "data": {
    "identifier": { "sku": "OLD-PRODUCT" }
  },
  "notes": "Discontinued product"
}
```

## Reference Data

### Brand IDs
| ID | Name | Slug |
|----|------|------|
| 1 | Orbit | orbit |
| 2 | Straub | straub |
| 3 | Teekay | teekay |

### Category IDs
| ID | Name | Slug |
|----|------|------|
| 1 | Industrial Valves | valves |
| 2 | Pipe Couplings | pipe-couplings |
| 3 | Pipe Repair Clamps | pipe-repair-clamps |
| 4 | Strainers | strainers |
| 5 | Rubber Expansion Joints | rubber-expansion-joints |
| 6 | Flange Adaptors | flange-adaptors |

### Subcategory IDs (partial)
| ID | Name | Category |
|----|------|----------|
| 1 | Butterfly Valve | valves |
| 2 | Duckbill Check Valve | valves |
| 3 | Gate Valve | valves |
| 4 | Ball Valve | valves |
| 5 | Foot Valve | valves |
| 6 | Y Strainer | strainers |
| 7 | Simplex Basket Strainer | strainers |

## Validation Rules

Before creating a request, verify:

1. **slug** - Lowercase, hyphenated, unique
2. **sku** - Uppercase, unique
3. **brandId** - Must be 1, 2, or 3
4. **categoryId** - Must be 1-6
5. **Required fields** - name, slug, sku, brandId, categoryId, description

## Tips for Replit AI

1. **Check catalog.ts** for examples of product structure
2. **Don't guess IDs** - Use the reference tables above
3. **Include context** in `notes` field
4. **One operation per file** - Easier to track and process
5. **Use ISO timestamps** - `new Date().toISOString()`

## For Claude Code

When processing requests:

1. Validate all required fields
2. Check for unique constraint violations before insert
3. Use transactions for multi-table operations
4. Record detailed results for debugging
5. Move to completed/ even if failed (with error details)
