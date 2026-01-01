# Video Audit Report

**Date**: 2026-01-01
**Status**: Complete

## Summary

| Source | Products with Videos | In Database |
|--------|---------------------|-------------|
| Neto CSV | 6 | 1 (OCCL) |
| Catalog.ts | 4 | 4 |
| **Total in DB** | - | **5** |

## Products WITH Videos in Database

| SKU | Slug | YouTube URL | Source |
|-----|------|-------------|--------|
| OCRC55 | orbit-pipe-repair-clamp-series-1-and-55mm-long | https://www.youtube.com/watch?v=VRei4m3c3Ck | catalog.ts |
| DB-1 | db-1-slip-on-duckbill-check-valve-neoprene | https://www.youtube.com/watch?v=iCanHpZe7EY | catalog.ts |
| OCFG-L | flex-grip-l-pipe-coupling | https://www.youtube.com/watch?v=sUyxmHis4gg | catalog.ts |
| CF8MDAFV | cf8m-flanged-float-valve-as4087-pn16 | https://www.youtube.com/watch?v=k7S7LLR78rs | catalog.ts |
| OCCL | combo-lock | https://www.youtube.com/watch?v=rNEvt2Y8fhs | Neto CSV (added) |

## Products NOT in Database (Have Videos in Neto)

These products exist in Neto with YouTube videos but are **INACTIVE in Neto** (intentionally not imported):

| SKU | Name | Video ID | Status in Neto |
|-----|------|----------|----------------|
| OCFGSTEP | Flex Grip Stepped | LbNszRB1yT4 | **Inactive** - Orbit |
| SF2H | Flex 2H | CcB5azysT-U | **Inactive** - Straub |
| SFF | Fire Fence | 5cVxjBL_-3E | **Inactive** - Straub |
| TKAL-FP | Teekay Axilock-FP, Type IV | E2RMKklPxFM | **Inactive** - Teekay |
| TKALS | Teekay Axilock S Type I | YMw-otis-hY | **Inactive** - Teekay |

See `docs/neto-migration-reference.md` for full inactive products list.

## Action Items

1. **DONE**: Updated OCCL with video URL
2. **NO ACTION NEEDED**: Other 5 products are inactive in Neto - videos are orphaned

## How to Add Videos

Videos can be added via:
1. **Inventory Admin** (`/admin/inventory`) - Click the video icon on any product
2. **Product Admin** (`/admin/products/{id}`) - Technical tab has Video URL field
3. **Database** - Update `products.video` field with full YouTube URL

## Test URLs

Try these product pages to verify video tab appears:
- http://localhost:3000/combo-lock (newly added)
- http://localhost:3000/flex-grip-l-pipe-coupling
- http://localhost:3000/orbit-pipe-repair-clamp-series-1-and-55mm-long
