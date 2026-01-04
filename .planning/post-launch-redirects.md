# Post-Launch Redirect Rules

**Purpose**: 301 redirects from old Neto site URLs to new Next.js site URLs
**Status**: Ready for launch
**Last Updated**: 2026-01-04

## Implementation

Redirects are implemented in `src/middleware.ts` in the `STATIC_REDIRECTS` object.

---

## Active Redirects (Already in Middleware)

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/bore-flex` | `/expansion-joints` | Category consolidation |
| `/bore-flex/single-sphere` | `/expansion-joints/single-sphere` | Subcategory |
| `/bore-flex/twin-sphere` | `/expansion-joints/twin-sphere` | Subcategory |
| `/bore-flex/single-arch` | `/expansion-joints/single-arch` | Subcategory |
| `/bore-flex/double-arch` | `/expansion-joints/double-arch` | Subcategory |
| `/bore-flex/reducing` | `/expansion-joints/reducing` | Subcategory |

---

## Redirects to Add at Launch

### Neto E-commerce URL Patterns

Common Neto URL patterns that may have been indexed:

```javascript
// Add to STATIC_REDIRECTS in middleware.ts

// Neto product/category patterns
'/products': '/products',  // Keep as-is if exists
'/shop': '/',
'/catalogue': '/products',
'/catalog': '/products',

// Cart/checkout (redirect to quote form)
'/cart': '/request-quote',
'/checkout': '/request-quote',
'/basket': '/request-quote',

// Account pages (no longer applicable)
'/account': '/',
'/my-account': '/',
'/login': '/',
'/register': '/',

// Search
'/search': '/products',

// Common category variations
'/pipe-fittings': '/pipe-couplings',
'/couplings': '/pipe-couplings',
'/repair-clamps': '/pipe-repair',
'/clamps': '/pipe-repair',
'/rubber-expansion-joints': '/expansion-joints',
'/flexible-joints': '/expansion-joints',
'/flanges': '/flange-adaptors',
'/flange-adapters': '/flange-adaptors',

// Brand variations
'/straub-couplings': '/brands/straub',
'/orbit-couplings': '/brands/orbit',
'/teekay-couplings': '/brands/teekay',
'/defender': '/brands/defender-valves',
'/boreflex': '/expansion-joints',
'/bore-flex-rubber': '/brands/bore-flex-rubber',

// Valve variations
'/butterfly-valves': '/valves/butterfly-valve',
'/check-valves': '/valves/check-valves',
'/gate-valves': '/valves/gate-valve',
'/ball-valves': '/valves/ball-valve',
'/foot-valves': '/valves/foot-valve',
'/float-valves': '/valves/float-valve',

// Strainer variations
'/y-strainers': '/strainers/y-strainer',
'/basket-strainers': '/strainers/simplex-basket-strainer',

// Info pages
'/about-us': '/about',
'/contact-us': '/contact',
'/shipping': '/delivery',
'/shipping-policy': '/delivery',
'/return-policy': '/returns',
'/privacy-policy': '/privacy',
'/terms': '/privacy',
'/faq': '/',
```

### Product-Specific Redirects

If old product URLs used different slugs (check Google Search Console after launch):

```javascript
// Example patterns - update based on actual old URLs
'/product/orbit-flex-grip': '/orbit-flex-grip-coupling',
'/product/straub-flex-1l': '/straub-flex-1l-coupling',
// ... add as discovered
```

---

## Implementation Steps

### Before Launch

1. Export URL list from Google Search Console (old site)
2. Identify top-trafficked pages
3. Map old URLs to new URLs
4. Add to `STATIC_REDIRECTS` in middleware.ts

### After Launch

1. Monitor 404 errors in Vercel logs
2. Check Google Search Console for crawl errors
3. Add missing redirects as discovered
4. Use the `redirects` database table for dynamic redirects if needed

---

## Vercel Redirects Alternative

For high-volume redirects, consider using `next.config.js`:

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true, // 301
      },
      // Wildcard example
      {
        source: '/product/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ];
  },
};
```

---

## Priority Redirects Checklist

- [x] `/bore-flex/*` → `/expansion-joints/*`
- [ ] `/shop` → `/`
- [ ] `/cart` → `/request-quote`
- [ ] `/catalogue` → `/products`
- [ ] Brand shortcut URLs
- [ ] Valve category variations
- [ ] Strainer category variations
- [ ] Old product slugs (from GSC data)

---

## Notes

- All redirects use 301 (permanent) for SEO
- Middleware redirects are checked before page rendering
- Database `redirects` table available for admin-managed redirects
- Monitor Vercel Analytics for 404 spikes post-launch
