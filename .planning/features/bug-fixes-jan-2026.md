# Bug Fixes & Improvements - January 2026

**Created**: 2026-01-24
**Type**: Bug Fixes
**Status**: In Progress
**Priority**: High

## Summary

Collection of bugs and improvements identified during SEO review and testing.

---

## Issue 1: Pipe Couplings Brand Links Broken

**Severity**: High (broken links)
**File**: `src/app/pipe-couplings/page.tsx` (line 320)

### Problem
Template literal using single quotes instead of backticks:
```tsx
href={'/pipe-couplings/${brand.slug}'}  // ❌ Outputs literal string
```

### Solution
```tsx
href={`/pipe-couplings/${brand.slug}`}  // ✅ Interpolates variable
```

### Affected Links
- `/pipe-couplings/straub` (Straub brand)
- `/pipe-couplings/orbit` (Orbit brand)
- `/pipe-couplings/teekay` (Teekay brand)

### Tasks
- [x] Fix template literal on line 320
- [x] Verify links work after fix

---

## Issue 2: Flex Grip S - All Prices Showing $269.00

**Severity**: Medium (data issue)
**Type**: Database

### Problem
All size variations for Flex Grip S (`OCFG-S`) are showing the same price ($269.00) instead of varying by size.

### Root Cause
Database `product_variations` table has incorrect/uniform prices for this product.

### Solution
1. Check actual price list from supplier
2. Update `product_variations` table with correct prices per size

### Tasks
- [ ] Get correct price list for Flex Grip S sizes
- [ ] Update database via admin panel or script
- [ ] Verify prices display correctly on product page

---

## Issue 3: www vs non-www Redirect Missing

**Severity**: Medium (SEO)
**File**: `src/middleware.ts`

### Problem
Google Search Console shows "User-declared canonical: None" and multiple URL variants:
- `https://www.dewaterproducts.com.au/...`
- `https://dewaterproducts.com.au/...`
- `http://dewaterproducts.com.au/...`

No forced redirect to canonical domain (non-www).

### Solution Options

**Option A: Middleware redirect (recommended)**
Add to `src/middleware.ts`:
```typescript
// At start of middleware function, before other redirects
const host = request.headers.get('host') || '';
if (host.startsWith('www.')) {
  const url = new URL(request.url);
  url.host = host.replace('www.', '');
  return NextResponse.redirect(url, 301);
}
```

**Option B: Vercel Dashboard**
Configure domain redirect in Vercel project settings.

### Tasks
- [x] Choose approach (A or B) → Option A (middleware)
- [x] Implement www → non-www redirect
- [ ] Verify with curl -I https://www.dewaterproducts.com.au (after deploy)

---

## Issue 4: SendGrid IP Blocked by Microsoft

**Severity**: High (emails failing to Hotmail/Outlook)
**Type**: External Service

### Problem
Quote emails to `@hotmail.com`, `@outlook.com`, `@live.com` addresses fail:
```
550 5.7.1 Unfortunately, messages from [149.72.126.143] weren't sent.
is on our block list (S3140)
```

SendGrid's shared IP is blocked by Microsoft.

### Solution Options

| Option | Cost | Notes |
|--------|------|-------|
| Contact SendGrid support | Free | Request IP review |
| Request IP pool change | Free | Move to cleaner pool |
| Dedicated IP | $60-90/mo | Full control of reputation |
| Add secondary email provider | Varies | Redundancy for critical emails |

### Tasks
- [ ] Contact SendGrid support about blocked IP
- [ ] Consider dedicated IP for production
- [ ] Add retry logic or backup notification

---

## Issue 5: Selection Guide Links Need Review

**Severity**: Low (some links may be broken)
**File**: `src/app/pipe-couplings/page.tsx` (lines 106-148)

### Problem
`selectionGuide` array contains product links that may point to:
- Old flat URLs (e.g., `/straub-couplings`)
- Products that don't exist
- Incorrect nested URLs

### Tasks
- [ ] Audit all links in `selectionGuide` array
- [ ] Update to correct product slugs or category pages
- [ ] Test each link resolves correctly

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/pipe-couplings/page.tsx` | Fix brand links (line 320), review selection guide |
| `src/middleware.ts` | Add www → non-www redirect |
| Database | Update Flex Grip S variation prices |

---

## Verification Checklist

- [ ] Build passes
- [ ] Brand links on /pipe-couplings work
- [ ] Flex Grip S shows varying prices
- [ ] www redirects to non-www (301)
- [ ] Test email delivery to Hotmail

---

Last Updated: 2026-01-24
