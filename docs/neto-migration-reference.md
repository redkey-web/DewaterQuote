# Neto Migration Reference

**For**: DeWater Products Team
**Purpose**: Reference for products from the original Neto e-commerce platform
**Last Updated**: December 2025

---

## Overview

Your website was migrated from Neto (your previous e-commerce platform) to a custom Next.js site. This document explains what product data exists in the original Neto export and helps you understand what's currently active vs inactive.

---

## Current State

| Category | Count | Notes |
|----------|-------|-------|
| **Products on website** | 126 | All active parent products imported |
| **Variations on website** | 1,277 | Size/price options |
| **Products in Neto export** | 1,635 | Full historical catalog |
| **Active in Neto** | 1,328 | Were live on old Neto site |
| **Inactive in Neto** | 307 | Were disabled/hidden on old site |

### Migration Status (Updated 2025-12-31)

All **83 active parent products** from Neto have been imported:
- 59 new products imported in Phase F5
- 24 products were already in the database
- 618 new size variations added

### Structure

The Neto export contains:
- **149 parent products** (main product listings)
- **1,486 variations** (size/price options for parents)

---

## Inactive Products Summary

These products were marked as **inactive** in Neto (not visible to customers on the old site).

### By Brand/Category

| Brand/Category | Total | Parents | Variations |
|----------------|-------|---------|------------|
| Orbit Couplings | 125 | 21 | 104 |
| Straub Couplings | 57 | 4 | 53 |
| Teekay Couplings | 38 | 8 | 30 |
| Simplex Basket Strainer 316 SS | 9 | 0 | 9 |
| Float Valve | 8 | 0 | 8 |
| Gate Valve CF8M 316SS ANSI 150LB | 6 | 0 | 6 |
| Knife Gate Valves | 6 | 0 | 6 |
| Universal Flange Adapter | 6 | 6 | 0 |
| Duckbill Check Valve | 6 | 5 | 1 |
| Other categories | 46 | 17 | 29 |
| **Total** | **307** | **66** | **241** |

---

## Inactive Parent Products (Full List)

These are the 66 main products (not size variations) that were inactive in Neto.

### Orbit Couplings (21 inactive parents)

| SKU | Product Name |
|-----|--------------|
| OCML-L406.4 | Metal Lock L |
| OCML-L427.0 | Metal Lock L |
| OCML-L457.2 | Metal Lock L |
| OCML-L508.0 | Metal Lock L |
| OCML-S427.0 | Metal Lock S |
| OCML-S457.2 | Metal Lock S |
| OCML-S508.0 | Metal Lock S |
| OCOF400-L914.4 | Open Flex 400-L |
| OCOF400-L1000.0 | Open Flex 400-L |
| OCOF400-L1016.0 | Open Flex 400-L |
| OCOF400-L1025.0 | Open Flex 400-L |
| OCOF400-L1035.0 | Open Flex 400-L |
| OCOF400-L1117.6 | Open Flex 400-L |
| OCOF400-L1229.0 | Open Flex 400-L |
| OCOF400-L1282.0 | Open Flex 400-L |
| OCOF400-L1320.8 | Open Flex 400-L |
| OCOF400-L1404.0 | Open Flex 400-L |
| OCOF400-L1422.4 | Open Flex 400-L |
| OCOF400-L1524.0 | Open Flex 400-L |
| OCRC100X48.3_ | Repair Clamp 100mm wide |
| OCRC400_88.9 | Repair Clamp 400mm wide |
| OCFGSTEP | Flex Grip Stepped |

### Straub Couplings (4 inactive parents)

| SKU | Product Name |
|-----|--------------|
| SF1L | Straub Flex 1L |
| SF2LS | Straub Flex 2LS |
| SMG | Straub Metal Grip |
| SOF | Straub Open Flex 1L |
| SFF | Straub Fire Fence |
| SF2H | Straub Flex 2H |
| SCSCE | Straub Clamp SCE x 200mm |

### Teekay Couplings (8 inactive parents)

| SKU | Product Name |
|-----|--------------|
| TKAF | Teekay Axiflex Type IV, PN16, 110mm wide |
| TKAFI | Teekay Axiflex Type I, PN16, 110mm wide |
| TKAFIV | Teekay Axiflex Type IV, PN16, 110mm wide |
| TKAFCR | Teekay Axiflex Central Register, Type I, PN6, 210mm wide |
| TKAL | Teekay Axilock Type IV, PN42 |
| TKAL-FP | Teekay Axilock-FP, Type IV |
| TKALS | Teekay Axilock S Type I, PN16 |
| TKRC | Teekay Repair Coupling Type I, PN16, 210mm wide |
| TKSC110wide | Teekay Stepped Coupling, 110mm wide, PN16 |
| TKSC140wide | Teekay Stepped Coupling, 140mm wide, PN16 |
| TKSC210wide | Teekay Stepped Coupling, 210mm wide, PN16 |

### Valves & Other (remaining inactive parents)

| SKU | Category | Product Name |
|-----|----------|--------------|
| BCV316BSP | Ball Check Valve | Ball Check Valve - 316 Stainless Steel - BSP |
| BCVCIT | Ball Check Valve | Ball Check Valve - Cast Iron FBE coated - BSP |
| BRONZESBS | Basket Strainer | Bronze Simplex Basket Strainer - ANSI 150LB |
| CF8MDAFV_100 | Float Valve | CF8M Flanged Float Valve AS4087 PN16 |
| DAFVE | Float Valve | Float Valve - Direct Acting Lever Operated |
| DPCVWCB150 | Check Valve | Dual Plate Check Valve - WCB/316/VITON ANSI 150LB |
| DPCVWCB10 | Check Valve | Dual Plate Check Valve - WCB/316/VITON ANSI 150LB |
| DPCVWCB15 | Check Valve | Dual Plate Check Valve - WCB/316/VITON ANSI 150LB |
| DPCVWCB300 | Check Valve | Dual Plate Check Valve - WCB/316/VITON ANSI 300LB |
| DB4DCV50 | Duckbill | DB-4 Inline Duckbill Check Valve - EPDM |
| DB4DCV65 | Duckbill | DB-4 Inline Duckbill Check Valve - EPDM |
| DB4DCV80 | Duckbill | DB-4 Inline Duckbill Check Valve - EPDM |
| ILDBCV50 | Duckbill | Inline Duck Bill Check Valve - EPDM |
| ILDBCV65 | Duckbill | Inline Duck Bill Check Valve - EPDM |
| DBS3W316_25 | Basket Strainer | Duplex Basket Strainer 316SS with 3 way flanged ball |
| KGVPN16 | Knife Gate | Knife Gate Valves - PN16 Rated |
| PVTE | Pinch Valve | Pinch Valve - Flanged Table E |
| SAREJ32 | Expansion Joint | Single Arch Rubber Expansion Joint (unfilled) |
| SAREJ40 | Expansion Joint | Single Arch Rubber Expansion Joint (unfilled) |
| UFA_80 | Flange Adapter | Universal Flange Adapter with Table E flange |
| UFA_100 | Flange Adapter | Universal Flange Adapter with Table E flange |
| UFA_150 | Flange Adapter | Universal Flange Adapter with Table E flange |
| UFA_200 | Flange Adapter | Universal Flange Adapter with Table E flange |
| UFA_250 | Flange Adapter | Universal Flange Adapter with Table E flange |
| UFA_300 | Flange Adapter | Universal Flange Adapter with Table E flange |
| 4844 | Test | Demo Test (test product) |

---

## Why Were Products Inactive?

Products may have been deactivated in Neto for various reasons:

| Reason | Example |
|--------|---------|
| **Discontinued** | Supplier no longer makes it |
| **Superseded** | Replaced by newer model |
| **Out of stock** | Long-term unavailability |
| **Seasonal** | Only sold at certain times |
| **Test products** | Demo/test data (e.g., SKU 4844) |
| **Duplicate** | Created in error |

---

## Reactivating Products

If you want to add any of these inactive products to your new website:

1. **Review the product** - Is it still available from your supplier?
2. **Check pricing** - Is the pricing in Neto still current?
3. **Gather assets** - Do you have images and datasheets?
4. **Contact your developer** - We can import specific products on request

### What We Need From You

To reactivate a product, provide:
- SKU(s) to import
- Current pricing (if different from Neto)
- Product images (if you have updated ones)
- Confirmation it's available for sale

---

## Products NOT in the Website

The new website focuses on your **core product range**:

- Orbit pipe couplings and repair clamps
- Straub couplings
- Teekay couplings
- Select valves and strainers

Some Neto products (like Universal Flange Adapters, some specialty valves) were not migrated because:
- They represent a small portion of sales
- They require specialist knowledge to sell
- They're better handled as quote-only items

**Want to add them?** Let us know and we can import them.

---

## Technical Reference

### Neto Export Location

The original Neto export is stored at:
```
.planning/audit/neto-export.csv
```

### Export Statistics

- **Total rows**: 1,635
- **Columns**: 78 fields
- **Parent products**: 149
- **Size variations**: 1,486
- **Active**: 1,328 (81%)
- **Inactive**: 307 (19%)

### Core Brands in Export

| Brand | Total Products | Active | Inactive |
|-------|---------------|--------|----------|
| Orbit Couplings | 800 | 675 | 125 |
| Straub Couplings | 80 | 23 | 57 |
| Teekay Couplings | 38 | 0 | 38 |
| Other (valves, strainers, etc.) | 717 | 630 | 87 |

---

## Questions?

Contact your developer if you need:
- Specific products imported from Neto
- A full export of inactive products with all details
- Help deciding which products to reactivate

---

*Reference document for Neto migration - December 2025*
