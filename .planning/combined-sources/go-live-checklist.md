# Go-Live Checklist

**Created**: 2026-01-09
**Type**: Deployment
**Status**: In Progress

## Quick Summary

The quote form submit button is disabled because Turnstile (spam protection) is configured but missing the server-side secret key. Either add the secret key or temporarily disable Turnstile.

---

## Critical: Environment Variables

### For Quote Form to Work

| Variable | Status | Where to Get |
|----------|--------|--------------|
| `SENDGRID_API_KEY` | ❌ NOT SET | [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys) |
| `TURNSTILE_SECRET_KEY` | ❌ NOT SET | [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) |

**Quick Fix Option:** Remove `NEXT_PUBLIC_TURNSTILE_SITE_KEY` from Vercel to disable spam protection temporarily.

### Add to Vercel Environment Variables

Go to: https://vercel.com/dashboard → dewater-products → Settings → Environment Variables

```
SENDGRID_API_KEY=SG.xxxxx
TURNSTILE_SECRET_KEY=xxxxx
CONTACT_EMAIL=sales@dewaterproducts.com.au
FROM_EMAIL=noreply@dewaterproducts.com.au
```

### Already Set (via Vercel Integration)
- `DATABASE_URL` ✅ (Neon)
- `BLOB_READ_WRITE_TOKEN` ✅ (Vercel Blob)
- `NEXTAUTH_SECRET` ✅ (should be set)

---

## Pre-Launch Checklist

### 1. Email Setup
- [ ] Create SendGrid account (free tier: 100 emails/day)
- [ ] Generate API key with Mail Send permissions
- [ ] Add `SENDGRID_API_KEY` to Vercel production env
- [ ] Verify sender email domain (optional but recommended)

### 2. Spam Protection
Choose ONE:
- [ ] **Option A:** Add Cloudflare Turnstile secret key
  - Get from: Cloudflare Dashboard → Turnstile → Site → Secret Key
  - Add `TURNSTILE_SECRET_KEY` to Vercel
- [ ] **Option B:** Disable Turnstile temporarily
  - Remove `NEXT_PUBLIC_TURNSTILE_SITE_KEY` from Vercel
  - Can re-enable later after launch

### 3. Domain & DNS
- [ ] Domain pointing to Vercel
- [ ] SSL certificate active (auto via Vercel)
- [ ] www redirect configured

### 4. SEO & Redirects
- [ ] Old URLs redirect to new (check `/api/redirects` or middleware)
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] robots.txt accessible at `/robots.txt`
- [ ] Submit sitemap to Google Search Console

### 5. Final Testing
- [ ] Quote form submits successfully
- [ ] Email received at sales inbox
- [ ] Customer receives confirmation email
- [ ] Admin panel accessible at `/admin`
- [ ] Products load from database
- [ ] Images load correctly

---

## Test Quote Form Locally

1. **Disable Turnstile temporarily** (for testing):
   ```bash
   # In .env.local, comment out:
   # NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
   ```

2. **Test without email** (dev mode skips email if no SendGrid key):
   - Form should submit and save to database
   - Check `/admin/quotes` for the submitted quote

3. **Add SendGrid key to test emails**:
   ```bash
   # In .env.local:
   SENDGRID_API_KEY=SG.your_key_here
   ```

---

## SendGrid Setup Guide

1. Go to https://sendgrid.com/ and create account
2. Navigate to Settings → API Keys
3. Create new API Key with "Mail Send" permission
4. Copy the key (starts with `SG.`)
5. Add to Vercel:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add `SENDGRID_API_KEY` for Production environment

---

## Cloudflare Turnstile Setup

1. Go to https://dash.cloudflare.com/
2. Click Turnstile in sidebar
3. Add site (or find existing)
4. Copy "Site Key" → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
5. Copy "Secret Key" → `TURNSTILE_SECRET_KEY`
6. Add both to Vercel environment variables

---

## Deployment

```bash
# Deploy to production
vercel --prod

# Or via GitHub (if connected)
git push origin main
```

---

## Post-Launch

- [ ] Monitor quote submissions in `/admin/quotes`
- [ ] Check email delivery in SendGrid dashboard
- [ ] Review Google Search Console for indexing
- [ ] Test mobile responsiveness
- [ ] Monitor Vercel Analytics

---

Last Updated: 2026-01-09
