# Redirect Map: Neto to Next.js Migration

This document outlines all necessary redirects when launching on `dewaterproducts.com.au`.

## Overview

| Type | Old Neto Pattern | New Next.js Pattern |
|------|------------------|---------------------|
| Products | `/{product-slug}` | `/{slug}` (root level - **same!**) |
| Categories | `/{category}/` | `/{category}` |
| Brand Pages | `/{brand}/` | `/{brand}` |
| Contact | `/form/contact-us/` | `/contact` |
| Cart | `/_mycart` | `/request-quote` |
| Account | `/_myacct*` | N/A (no account system) |

**Good news:** Product URLs are now at root level, matching the old Neto structure. This means **minimal product redirects needed!**

---

## Category Redirects

These map old Neto category URLs to new category pages:

| Old URL | New URL | Status |
|---------|---------|--------|
| `/expansion-joints/` | `/rubber-expansion-joints` | 301 |
| `/valves/` | `/valves` | Same |
| `/strainers/` | `/strainers` | Same |
| `/pipe-couplings/` | `/pipe-couplings` | Same |
| `/pipe-repair-clamps/` | `/pipe-repair` | 301 |
| `/check-valves/` | `/valves` | 301 |

---

## Product URLs

**No redirects needed for most products!**

Products on both old Neto and new Next.js use root-level URLs:
- Old: `/{product-slug}`
- New: `/{slug}`

The only product redirects needed are if the **slug has changed** between systems. Check that product slugs in the new database match the old Neto URLs.

### Slug Verification Checklist

Before launch, verify these slugs match:

| Product | Expected Slug |
|---------|---------------|
| Butterfly Valve CF8M | `butterfly-valve-316-stainless-steel-cf8m-body-ptfe` |
| DB-1 Duckbill | `db-1-slip-on-duckbill-check-valve-neoprene` |
| Flex Grip L | `flex-grip-l` |
| Flex Grip S | `flex-grip-s` |
| Y-Strainer | `y-strainer-cast-iron-flanged` |

---

## Static Page Redirects

| Old Neto URL | New Next.js URL |
|--------------|-----------------|
| `/index.html` | `/` |
| `/home` | `/` |
| `/form/contact-us/` | `/contact` |
| `/contact-us/` | `/contact` |
| `/_mycart` | `/request-quote` |
| `/quote` | `/request-quote` |
| `/about-us/` | `/contact` |
| `/delivery-policy/` | `/contact` |
| `/returns-policy/` | `/contact` |

---

## Account Page Redirects (to homepage)

Neto account pages have no equivalent - redirect to homepage:

| Old Neto URL | New URL |
|--------------|---------|
| `/_myacct` | `/` |
| `/_myacct/payrec` | `/` |
| `/_myacct/*` | `/` |

---

## Brand Pages

| Old Neto URL | New Next.js URL |
|--------------|-----------------|
| `/straub/` | `/straub` |
| `/orbit/` | `/orbit` |
| `/teekay/` | `/teekay` |
| `/brands/straub/` | `/straub` |
| `/brands/orbit/` | `/orbit` |
| `/brands/teekay/` | `/teekay` |

---

## Wildcard/Catch-All Redirects

These handle any old product URLs at root level:

```
# Any product at root level → search in /products/
/{slug} → /products/{slug}
```

**Note:** This requires dynamic redirect logic or a 404 page with search.

---

## Implementation in next.config.js

```javascript
async redirects() {
  return [
    // Category redirects
    {
      source: '/expansion-joints/:path*',
      destination: '/rubber-expansion-joints',
      permanent: true,
    },
    {
      source: '/check-valves/:path*',
      destination: '/valves',
      permanent: true,
    },

    // Static page redirects
    {
      source: '/index.html',
      destination: '/',
      permanent: true,
    },
    {
      source: '/form/contact-us',
      destination: '/contact',
      permanent: true,
    },
    {
      source: '/contact-us',
      destination: '/contact',
      permanent: true,
    },
    {
      source: '/_mycart',
      destination: '/request-quote',
      permanent: true,
    },
    {
      source: '/quote',
      destination: '/request-quote',
      permanent: true,
    },

    // Account pages (no equivalent)
    {
      source: '/_myacct/:path*',
      destination: '/',
      permanent: false,
    },

    // Brand redirects
    {
      source: '/brands/straub',
      destination: '/straub',
      permanent: true,
    },
    {
      source: '/brands/orbit',
      destination: '/orbit',
      permanent: true,
    },
    {
      source: '/brands/teekay',
      destination: '/teekay',
      permanent: true,
    },

    // Legacy info pages
    {
      source: '/about-us/:path*',
      destination: '/contact',
      permanent: true,
    },
    {
      source: '/delivery-policy/:path*',
      destination: '/contact',
      permanent: true,
    },
    {
      source: '/returns-policy/:path*',
      destination: '/contact',
      permanent: true,
    },
    {
      source: '/buying/:path*',
      destination: '/products',
      permanent: true,
    },
  ]
}
```

---

## Products Requiring Database Query

To generate the full product redirect list, run this query against the database:

```sql
SELECT
  slug as new_slug,
  sku,
  name
FROM products
ORDER BY name;
```

This will give you all product slugs to map from old Neto URLs.

---

## TODO Before Launch

- [ ] Export full product list from Neto with URLs
- [ ] Match Neto URLs to new database slugs
- [ ] Add all product redirects to next.config.js
- [ ] Test all redirects in staging
- [ ] Set up Google Search Console to track 404s
- [ ] Submit new sitemap to Google after launch

---

## Monitoring After Launch

1. **Google Search Console** - Monitor for 404 errors and crawl issues
2. **GA4 Events** - Track `page_not_found` events if configured
3. **Vercel Analytics** - Check for failed requests

---

## Notes

- All redirects should be **301 (permanent)** for SEO value transfer
- Test redirects with `curl -I https://domain.com/old-url` to verify
- Allow 2-4 weeks for Google to process redirect changes
