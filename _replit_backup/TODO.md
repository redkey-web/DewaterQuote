# TODO - deWater Products Website

## Migration Tasks

### Remove Neto API Integration
**Priority:** After full migration from dewaterproducts.com.au is complete

Once all product data has been fully migrated to this new platform and the old Neto/Maropost store is decommissioned, remove the Neto API integration:

1. Delete `server/neto.ts`
2. Remove Neto routes from `server/routes.ts`
3. Remove environment variables:
   - `NETO_API_KEY`
   - `NETO_API_USERNAME`
4. Update `replit.md` to remove Neto API references

---

## Completed
- [x] Hero section with new product photography
- [x] Volume discount bar (light theme, scrolling)
- [x] Industrial-styled CTA buttons
- [x] Product catalog with filtering
- [x] Quote cart system
- [x] Request for Quote form
