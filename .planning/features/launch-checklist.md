# Launch Checklist - Go-Live & SEO Redirects

**Created**: 2026-01-10
**Type**: Deployment
**Status**: Active
**Combined from**:
  - go-live-checklist.md
  - seo-redirects-preservation.md

## Summary

Complete checklist for launching the site to production, including environment variable setup, email configuration, spam protection, DNS, and SEO redirect implementation to preserve rankings from old URLs.

---

## Critical: Quote Form Fix

The quote form submit button is disabled because Turnstile (spam protection) is configured but missing the server-side secret key.

### Required Environment Variables

| Variable | Status | Where to Get |
|----------|--------|--------------|
| `SENDGRID_API_KEY` | ❌ NOT SET | [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys) |
| `TURNSTILE_SECRET_KEY` | ❌ NOT SET | [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) |

**Quick Fix Option:** Remove `NEXT_PUBLIC_TURNSTILE_SITE_KEY` from Vercel to disable spam protection temporarily.

---

## Phase 1: Email & Spam Protection

### 1.1 SendGrid Setup
- [ ] Create SendGrid account (free tier: 100 emails/day)
- [ ] Generate API key with Mail Send permissions
- [ ] Add `SENDGRID_API_KEY` to Vercel production env
- [ ] Verify sender email domain (optional but recommended)

### 1.2 Turnstile (Spam Protection)

**Current Issue**: "Invalid domain" error on Vercel preview deployments because Turnstile is only configured for production domain. Forms still submit because server-side verification bypasses when no secret key is set.

#### Option A: Full Turnstile Setup (Recommended for Production)

**Step 1: Configure Turnstile Widget in Cloudflare**
- [ ] Go to [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
- [ ] Click "Add site" (or edit existing)
- [ ] **Widget name**: Dewater Products
- [ ] **Domains**: Add ALL domains that will use the widget:
  - `dewaterproducts.com.au` (production)
  - `www.dewaterproducts.com.au` (www redirect)
  - `*.vercel.app` (for preview deployments)
  - `localhost` (for local development)
- [ ] **Widget Mode**: Managed (recommended) or Non-interactive
- [ ] Save and copy keys

**Step 2: Add Environment Variables to Vercel**
- [ ] Go to Vercel Dashboard → dewater-products → Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (Site Key from Cloudflare)
- [ ] Add `TURNSTILE_SECRET_KEY` (Secret Key from Cloudflare)
- [ ] Apply to: Production + Preview environments

**Step 3: Re-enable Turnstile in Code**
- [ ] Update `src/app/request-quote/page.tsx:171`:
  ```typescript
  // Change from:
  const turnstileRequired = false
  // To:
  const turnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  ```

**Step 4: Test**
- [ ] Test on preview deployment (no "invalid domain" error)
- [ ] Test on localhost
- [ ] Verify form submission works with valid token

#### Option B: Disable Turnstile Temporarily
- [ ] Remove `NEXT_PUBLIC_TURNSTILE_SITE_KEY` from Vercel env vars
- [ ] Keep `turnstileRequired = false` in code
- [ ] Add to post-launch TODO: Configure Turnstile properly

### 1.3 Environment Variables in Vercel
```
SENDGRID_API_KEY=SG.xxxxx
TURNSTILE_SECRET_KEY=xxxxx
CONTACT_EMAIL=sales@dewaterproducts.com.au
FROM_EMAIL=noreply@dewaterproducts.com.au
```

**Already Set (via Vercel Integration):**
- `DATABASE_URL` ✅ (Neon)
- `BLOB_READ_WRITE_TOKEN` ✅ (Vercel Blob)
- `NEXTAUTH_SECRET` ✅

---

## Phase 2: SEO Redirects

### 2.1 Completed Redirects ✅
- [x] `/straub-couplings-repair-clamps` → `/brand/straub-couplings` (kept old URL)
- [x] Created `/duckbill-check-valves` page
- [x] Created `/muff-couplings` info page

### 2.2 High Priority Redirects
| Old URL | New URL | Priority |
|---------|---------|----------|
| `/rubber-expansion-joints/fsf-single-sphere/` | `/single-sphere-expansion-joints` | High |
| `/rubber-expansion-joints/double-arch-rubber-expansion-joint/` | `/double-arch-expansion-joints` | High |
| `/rubber-expansion-joints/twin-sphere-rubber-expansion-joint-ftf/` | `/twin-sphere-expansion-joints` | High |

- [ ] Add to `src/middleware.ts` STATIC_REDIRECTS object
- [ ] Use 301 (permanent) redirects

### 2.3 Brand/Category Redirects
- [ ] `/brand/teekay-couplings/` → `/brands/teekay`
- [ ] `/brand/flanged-suction-strainer/` → `/flanged-suction-strainers`
- [ ] `/flange-adapters/` → `/flange-adaptors`
- [ ] `/strainers/simplex-basket-strainer/` → `/basket-strainers`
- [ ] `/strainers/duplex-basket-strainer/` → `/duplex-basket-strainers`

### 2.4 Product Page Redirects
- [ ] `/orbit-pipe-repair-clamp-series-1-and-200mm-long` → `/pipe-repair-clamps`
- [ ] `/orbit-pipe-repair-clamp-series-1-and-100mm-long` → `/pipe-repair-clamps`
- [ ] `/flex-grip-open-l` → `/orbit-couplings`
- [ ] `/metal-lock-s` → `/orbit-couplings`
- [ ] `/plast-coupling` → `/orbit-couplings`
- [ ] `/elbow-repair-clamp` → `/pipe-repair-clamps`
- [ ] `/control-rod-rubber-expansion-joint-accessory` → `/expansion-joints`

### 2.5 Valve Category Redirects
- [ ] `/valves/knife-gate-valves/` → `/industrial-valves`
- [ ] `/valves/foot-valve/` → `/foot-valves`
- [ ] `/valves/butterfly-valve/` → `/butterfly-valves`
- [ ] `/valves/swing-check-valve/` → `/check-valves`
- [ ] `/valves/float-valve/` → `/float-valves`
- [ ] `/valves/ball-check-valve/` → `/ball-valves`

### 2.6 Low Priority Redirects (Optional)
- [ ] `/strainers/heavy-duty-y-strainer-filter-screen/` → `/y-strainers`
- [ ] `/muff-couplings-aluminium-table-d-e` → `/muff-couplings`
- [ ] `/foot-valve-galvanised-flanged-table-d` → `/foot-valves`
- [ ] `/foot-valve-hdpe-flanged-table-e` → `/foot-valves`

---

## Phase 3: Domain & DNS

- [ ] Domain pointing to Vercel
- [ ] SSL certificate active (auto via Vercel)
- [ ] www redirect configured
- [ ] Add `metadataBase: 'https://dewaterproducts.com.au'` to `src/app/layout.tsx` metadata export

---

## Phase 4: SEO Verification

- [ ] Old URLs redirect to new (test sample URLs)
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] robots.txt accessible at `/robots.txt`
- [ ] Submit sitemap to Google Search Console

---

## Phase 5: Final Testing

- [ ] Quote form submits successfully
- [ ] Email received at sales inbox
- [ ] Customer receives confirmation email
- [ ] Admin panel accessible at `/admin`
- [ ] Products load from database
- [ ] Images load correctly

---

## Phase 6: Post-Launch

- [ ] Monitor quote submissions in `/admin/quotes`
- [ ] Check email delivery in SendGrid dashboard
- [ ] Review Google Search Console for indexing
- [ ] Test mobile responsiveness
- [ ] Monitor Vercel Analytics

---

## Implementation Notes

### Middleware Redirects
Add to `src/middleware.ts`:

```typescript
const STATIC_REDIRECTS: Record<string, string> = {
  '/rubber-expansion-joints/fsf-single-sphere/': '/single-sphere-expansion-joints',
  '/rubber-expansion-joints/double-arch-rubber-expansion-joint/': '/double-arch-expansion-joints',
  '/brand/teekay-couplings/': '/brands/teekay',
  // ... add all redirects
};
```

### Key SEO Observations
1. **Duckbill Valve** - Had 40 traffic, ranking #7 for "duckbill valve" (vol 200). Dedicated page created.
2. **Muff Couplings** - Lost 37 traffic, ranking #2 for "muff coupling" (vol 80). Info page created.
3. **Straub Couplings** - Old `/brand/straub-couplings/` ranked #7 for "straub coupling" (vol 200). URL preserved.
4. **Expansion Joints** - Flat URL structure working well, gaining traffic.

---

## Source References
- Original: `.planning/combined-sources/go-live-checklist.md`
- Original: `.planning/combined-sources/seo-redirects-preservation.md`

---

Last Updated: 2026-01-10

### Technical Notes

**Why forms submit despite "invalid domain" error:**
- `src/lib/turnstile.ts:47-49` - Server skips verification if `TURNSTILE_SECRET_KEY` not set
- `src/app/request-quote/page.tsx:171` - `turnstileRequired` explicitly set to `false`
- This is intentional for testing but must be fixed before go-live
