# Neto CSV Field Audit

**Date**: 2025-12-31
**Source**: `.planning/audit/neto-export.csv`
**Total Rows**: 1,635 (149 parent products, 1,486 variations)
**Total Columns**: 78

---

## Summary

| Usage Level | Count | Description |
|-------------|-------|-------------|
| Never Used (0%) | 39 | Empty or all zeros - client never used |
| Rarely Used (<10%) | 8 | Minimal data entered |
| Partially Used (10-90%) | 2 | Some products have data |
| Well Used (>90%) | 29 | Core product data |

---

## Never Used (39 columns)

These fields were **never populated** in the client's Neto system. They should NOT be shown in admin interfaces.

### Pricing Fields (All Zeros)
| Field | Status |
|-------|--------|
| RRP | 1,635 zeros |
| Cost Price | 1,635 zeros |
| Default Purchase Price | 1,632 zeros |
| Promotion Price | Empty |
| Price (B) | Empty |
| Price (C) | Empty |
| Price (D) | Empty |
| Price (E) | Empty |
| Price (F) | Empty |

### Supply Chain (Never Used)
| Field | Status |
|-------|--------|
| Primary Supplier | Empty |
| Supplier Item Code | Empty |
| Supplier Product Name | Empty |
| Incoming Qty | 1,635 zeros |
| Preorder Qty | 1,635 zeros |

### Shipping (Never Used)
| Field | Status |
|-------|--------|
| Shipping Category | 1,635 zeros |
| Handling Time (days) | 185 zeros, rest empty |

### E-commerce Identifiers (Never Used)
| Field | Status |
|-------|--------|
| UPC/EAN | Empty |
| UPC/EAN 1 | Empty |
| UPC/EAN 2 | Empty |
| UPC/EAN 3 | Empty |
| ePID for eBay United States | Empty |
| ePID for eBay Canada (English) | Empty |
| ePID for eBay UK | Empty |
| ePID for eBay Australia | Empty |
| ePID for eBay Germany | Empty |

### Other Never Used
| Field | Status |
|-------|--------|
| Selling Unit of Measure | Empty |
| Specific Type 2 | Empty |
| Specific Value 2 | Empty |
| Specific Type 3 | Empty |
| Specific Value 3 | Empty |
| Custom Label/Code | Empty |
| Kit Components | Empty |
| pdf2 | Empty |
| pdf3 | Empty |
| Pick Zone | Empty |
| Upsell Products | Empty |
| Tax Category | Empty |
| Promotion ID | Empty |
| Display Template | Empty |

---

## Rarely Used (<10% filled) - 8 columns

| Field | Filled | % | Sample |
|-------|--------|---|--------|
| Subtitle | 4 | 0.2% | "D - Series Encapsulating Clamp" |
| Description | 115 | 7.0% | HTML content |
| SEO Meta Keywords | 156 | 9.5% | "316 stainless steel basket strainer" |
| SEO Meta Description | 158 | 9.7% | "stainless steel basket strainer" |
| Sort Order 1 | 61 | 3.7% | "2" |
| Sort Order 2 | 59 | 3.6% | "2" |
| Youtube Video ID | 84 | 5.1% | "rY3rQQrsH1k" |
| Qty In Stock | 43 | 2.6% | "5" |

---

## Partially Used (10-90%) - 2 columns

| Field | Filled | % |
|-------|--------|---|
| Bullet points | 1,398 | 85.5% |
| Short Description | 1,325 | 81.0% |

---

## Well Used (>90%) - 29 columns

### Core Product Data
| Field | Filled | % |
|-------|--------|---|
| SKU* | 1,635 | 100% |
| Parent SKU | 1,486 | 90.9% |
| Name | 1,635 | 100% |
| Brand | 1,629 | 99.6% |
| Active | 1,635 | 100% |
| Category | 1,634 | 99.9% |
| Price (Default) | 1,634 | 99.9% |
| Price (A) | 1,634 | 99.9% |

### Product Attributes
| Field | Filled | % |
|-------|--------|---|
| Specific Type 1 | 1,520 | 93.0% |
| Specific Value 1 | 1,520 | 93.0% |
| Lead Time | 1,574 | 96.3% |
| SEO Page Title | 1,549 | 94.7% |

### Shipping Dimensions
| Field | Filled | % |
|-------|--------|---|
| Height (Shipping) | 1,635 | 100% |
| Width (Shipping) | 1,635 | 100% |
| Length (Shipping) | 1,635 | 100% |
| Weight (shipping) | 1,635 | 100% |
| Cubic (Shipping) | 1,635 | 100% |

### System Fields
| Field | Filled | % |
|-------|--------|---|
| Approved | 1,635 | 100% |
| Virtual | 1,635 | 100% |
| Tax Free Item | 1,635 | 100% |
| Tax Inclusive | 1,635 | 100% |
| Enquire Now | 1,635 | 100% |
| Split for Warehouse Picking | 1,635 | 100% |
| Editable Kits | 1,635 | 100% |
| Service Item | 1,635 | 100% |
| Date Added | 1,635 | 100% |
| Date Of Arrival | 1,635 | 100% |
| Promotion Start Date | 1,635 | 100% |
| Promotion Expiry Date | 1,635 | 100% |

---

## Implications for Admin UI

### Remove from Pricing Page
- **Cost** column - always 0, no margin calculation possible
- **RRP** column - always 0
- **Margin** column - meaningless without cost data
- **Promo** column - never used
- **Tier Pricing (B-F)** - never used

### Keep on Pricing Page
- **SKU** - 100% filled
- **Name** - 100% filled
- **Sell Price** - 99.9% filled (Price Default)
- **Price A** - same as Sell, can hide
- **Size variations** - for products with priceVaries

### Consider for Future
If the client wants to use Cost/RRP/Margin features, they would need to:
1. Enter cost prices manually in admin
2. The margin calculations would then work

---

## Notes

- **Price (A)** appears to be the same as **Price (Default)** - both are the sell price
- **Promotion Start/Expiry Date** fields exist and are "filled" but with default dates, no actual promotions
- **Specific Type 1/Value 1** contain pipe size data (e.g., "48.3mm")
- **Short Description** is actually the product bullet points in many cases
