# Launch Checklist - Go-Live & SEO Redirects

**Created**: 2026-01-10
**Updated**: 2026-01-24
**Type**: Deployment
**Status**: ✅ COMPLETE (Live)
**Combined from**:
  - go-live-checklist.md
  - seo-redirects-preservation.md

## Summary

Complete checklist for launching the site to production, including environment variable setup, email configuration, spam protection, DNS, and SEO redirect implementation to preserve rankings from old URLs.

**Site is LIVE at**: https://dewaterproducts.com.au

---

## Critical: Quote Form Fix ✅ RESOLVED

~~The quote form submit button is disabled because Turnstile (spam protection) is configured but missing the server-side secret key.~~

### Required Environment Variables

| Variable | Status | Where to Get |
|----------|--------|--------------|
| `SENDGRID_API_KEY` | ✅ SET | [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys) |
| `TURNSTILE_SECRET_KEY` | ✅ SET | [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) |

~~**Quick Fix Option:** Remove `NEXT_PUBLIC_TURNSTILE_SITE_KEY` from Vercel to disable spam protection temporarily.~~

---

## Phase 1: Email & Spam Protection ✅ COMPLETE

### 1.1 SendGrid Setup ✅
- [x] Create SendGrid account (free tier: 100 emails/day)
- [x] Generate API key with Mail Send permissions
- [x] Add `SENDGRID_API_KEY` to Vercel production env
- [x] Verify sender email domain

### 1.2 Turnstile (Spam Protection) ✅

- [x] Configured Turnstile Widget in Cloudflare for production domain
- [x] Added `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to Vercel
- [x] Added `TURNSTILE_SECRET_KEY` to Vercel
- [x] Forms working with spam protection

### 1.3 Environment Variables in Vercel ✅
All required env vars set:
- `SENDGRID_API_KEY` ✅
- `TURNSTILE_SECRET_KEY` ✅
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` ✅
- `CONTACT_EMAIL` ✅
- `FROM_EMAIL` ✅
- `DATABASE_URL` ✅ (Neon)
- `BLOB_READ_WRITE_TOKEN` ✅ (Vercel Blob)
- `NEXTAUTH_SECRET` ✅

---

## Phase 2: SEO Redirects ✅ COMPLETE

All redirects implemented in `src/middleware.ts` via URL restructure (2026-01-24).
80+ static redirects + wildcard patterns for old Neto URLs.

### 2.1 Previously Completed ✅
- [x] `/straub-couplings-repair-clamps` → `/pipe-couplings/straub`
- [x] Created `/industrial-valves/duckbill-valves` page
- [x] Created `/pipe-couplings/muff-couplings` page

### 2.2 High Priority Redirects ✅
- [x] `/rubber-expansion-joints/fsf-single-sphere` → `/expansion-joints/single-sphere`
- [x] `/rubber-expansion-joints/double-arch-rubber-expansion-joint` → `/expansion-joints/double-arch`
- [x] `/rubber-expansion-joints/twin-sphere-rubber-expansion-joint-ftf` → `/expansion-joints/twin-sphere`

### 2.3 Brand/Category Redirects ✅
- [x] `/brand/teekay-couplings` → `/pipe-couplings/teekay`
- [x] `/brand/flanged-suction-strainer` → `/strainers/suction-strainers`
- [x] `/flange-adapters` → `/flange-adaptors`
- [x] `/strainers/simplex-basket-strainer` → `/strainers/basket-strainers`
- [x] `/strainers/duplex-basket-strainer` → `/strainers/duplex-strainers`

### 2.4 Product Page Redirects ✅
- [x] `/orbit-pipe-repair-clamp-series-1-and-200mm-long` → `/pipe-repair-clamps`
- [x] `/orbit-pipe-repair-clamp-series-1-and-100mm-long` → `/pipe-repair-clamps`
- [x] `/flex-grip-open-l` → `/pipe-couplings`
- [x] `/metal-lock-s` → `/pipe-couplings/straub`
- [x] `/plast-coupling` → `/pipe-couplings`
- [x] `/elbow-repair-clamp` → `/pipe-repair-clamps`
- [x] `/control-rod-rubber-expansion-joint-accessory` → `/expansion-joints`

### 2.5 Valve Category Redirects ✅
- [x] `/valves/knife-gate-valves` → `/industrial-valves/gate-valves`
- [x] `/valves/foot-valve` → `/industrial-valves/foot-valves`
- [x] `/valves/butterfly-valve` → `/industrial-valves/butterfly-valves`
- [x] `/valves/swing-check-valve` → `/industrial-valves/check-valves`
- [x] `/valves/float-valve` → `/industrial-valves/float-valves`
- [x] `/valves/ball-check-valve` → `/industrial-valves/check-valves`

### 2.6 Low Priority Redirects ✅
- [x] `/strainers/heavy-duty-y-strainer-filter-screen` → `/strainers/y-strainers`
- [x] `/muff-couplings-aluminium-table-d-e` → `/pipe-couplings/muff-couplings`
- [x] `/foot-valve-galvanised-flanged-table-d` → `/industrial-valves/foot-valves`
- [x] `/foot-valve-hdpe-flanged-table-e` → `/industrial-valves/foot-valves`

---

## Phase 3: Domain & DNS ✅ COMPLETE

- [x] Domain pointing to Vercel (dewaterproducts.com.au)
- [x] SSL certificate active (auto via Vercel)
- [x] www redirect configured
- [x] `metadataBase` configured in layout.tsx

---

## Phase 4: SEO Verification ✅ COMPLETE

- [x] Old URLs redirect to new (301 redirects verified working 2026-01-24)
- [x] Sitemap accessible at `/sitemap.xml` (91 URLs)
- [x] robots.txt accessible at `/robots.txt`
- [ ] Submit sitemap to Google Search Console (client to do)

---

## Phase 5: Final Testing ✅ COMPLETE

- [x] Quote form submits successfully
- [x] Email received at sales inbox (sales@dewaterproducts.com.au)
- [x] Customer receives confirmation email
- [x] Admin panel accessible at `/admin`
- [x] Products load from database
- [x] Images load correctly

---

## Phase 6: Post-Launch (Ongoing)

- [x] Check email delivery in SendGrid dashboard
- [ ] Monitor quote submissions in `/admin/quotes`
- [ ] Review Google Search Console for indexing
- [ ] Test mobile responsiveness
- [ ] Monitor Vercel Analytics

---

## Key SEO Observations

1. **URL Restructure (2026-01-24)**: Migrated from flat URLs to nested structure for topical authority
   - `/butterfly-valves` → `/industrial-valves/butterfly-valves`
   - All old URLs 301 redirect to new nested URLs
2. **Duckbill Valve** - Dedicated page at `/industrial-valves/duckbill-valves`
3. **Muff Couplings** - Page at `/pipe-couplings/muff-couplings`
4. **Expansion Joints** - Optimized for "rubber bellows" keyword

---

## Source References
- Original: `.planning/combined-sources/go-live-checklist.md`
- Original: `.planning/combined-sources/seo-redirects-preservation.md`

---

Last Updated: 2026-01-24
