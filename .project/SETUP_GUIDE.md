# deWater Products - Service Setup Guide

Quick reference for setting up external services for the deWater Products website.

---

## Cloudflare Turnstile (Spam Protection)

### Step 1: Create Turnstile Site

1. Go to https://dash.cloudflare.com → **Turnstile**
2. Click **Add site**
3. Fill in:
   - **Site name**: deWater Products
   - **Domain**: `dewater-products.vercel.app` (add `dewaterproducts.com.au` later)
   - **Widget Mode**: Managed (recommended)
4. Click **Create**
5. Copy the **Site Key** and **Secret Key**

### Step 2: Add to Vercel

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x...` (site key) | Production, Preview |
| `TURNSTILE_SECRET_KEY` | `0x...` (secret key) | Production, Preview |

### Step 3: Verify

After deployment, the Turnstile widget will appear on:
- /contact
- /request-quote

---

## SendGrid (Email Service)

### Option A: Single Sender Verification (Quick Setup - Testing)

Use this for testing. No DNS required.

1. Go to https://app.sendgrid.com/settings/sender_auth/senders
2. Click **Create New Sender**
3. Fill in:
   - **From Email**: `sales@dewaterproducts.com.au`
   - **From Name**: deWater Products
   - **Reply To**: `sales@dewaterproducts.com.au`
   - **Company Address**: Perth, WA (fill required fields)
4. Click **Create**
5. Check inbox for verification email and click link
6. Create API Key:
   - Go to https://app.sendgrid.com/settings/api_keys
   - Click **Create API Key**
   - Name: `dewater-products`
   - Permissions: **Restricted Access** → Mail Send: Full Access
   - Copy the key (shown only once)

### Option B: Domain Authentication (Production)

Better deliverability, requires DNS access to dewaterproducts.com.au.

1. Go to https://app.sendgrid.com/settings/sender_auth
2. Click **Authenticate Your Domain**
3. Select DNS host (or "Other")
4. Enter domain: `dewaterproducts.com.au`
5. Add the DNS records SendGrid provides:
   - 3 CNAME records for DKIM
   - 1 TXT record for SPF
6. Click **Verify**

### Step 3: Add to Vercel

| Variable | Value | Environments |
|----------|-------|--------------|
| `SENDGRID_API_KEY` | `SG.xxx...` | Production, Preview |
| `CONTACT_EMAIL` | `sales@dewaterproducts.com.au` | Production, Preview |
| `FROM_EMAIL` | `sales@dewaterproducts.com.au` | Production, Preview |

---

## Upstash Redis (Rate Limiting)

Rate limiting is implemented but optional. Forms work without it.

1. Go to https://console.upstash.com
2. Create a new Redis database
3. Choose region closest to Vercel (us-east-1 recommended)
4. Copy REST URL and Token

### Add to Vercel

| Variable | Value | Environments |
|----------|-------|--------------|
| `UPSTASH_REDIS_REST_URL` | `https://xxx.upstash.io` | Production, Preview |
| `UPSTASH_REDIS_REST_TOKEN` | `AXxx...` | Production, Preview |

---

## Custom Domain (dewaterproducts.com.au)

### Step 1: Add Domain in Vercel

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Click **Add**
3. Enter: `dewaterproducts.com.au`
4. Also add: `www.dewaterproducts.com.au`

### Step 2: Update DNS Records

At your DNS provider, add:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### Step 3: Update Environment Variables

| Variable | New Value |
|----------|-----------|
| `NEXTAUTH_URL` | `https://dewaterproducts.com.au` |

### Step 4: Update Turnstile Domain

In Cloudflare Dashboard → Turnstile → your site:
- Add `dewaterproducts.com.au` to allowed domains

---

## Vercel Blob (File Storage)

Already configured via Vercel integration.

| Variable | Status |
|----------|--------|
| `BLOB_READ_WRITE_TOKEN` | ✅ Auto-set by Vercel |

---

## Environment Variables Checklist

### Required (Core Functionality)

| Variable | Status | Notes |
|----------|--------|-------|
| `DATABASE_URL` | ✅ Set | Neon Postgres |
| `NEXTAUTH_SECRET` | ✅ Set | Auth encryption |
| `NEXTAUTH_URL` | ✅ Set | Update when adding custom domain |
| `BLOB_READ_WRITE_TOKEN` | ✅ Set | Vercel Blob auto-config |

### Required (Forms)

| Variable | Status | Notes |
|----------|--------|-------|
| `SENDGRID_API_KEY` | ⏳ Pending | Email sending |
| `CONTACT_EMAIL` | ✅ Set | Form recipient |
| `FROM_EMAIL` | ✅ Set | Form sender |

### Required (Security)

| Variable | Status | Notes |
|----------|--------|-------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ⏳ Pending | Spam protection (public) |
| `TURNSTILE_SECRET_KEY` | ⏳ Pending | Spam protection (server) |

### Optional (Enhanced Security)

| Variable | Status | Notes |
|----------|--------|-------|
| `UPSTASH_REDIS_REST_URL` | ⏳ Optional | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | ⏳ Optional | Rate limiting |

---

## Deployment After Setup

After adding environment variables:

```bash
# Redeploy to pick up new env vars
vercel --prod
```

Or push a commit to trigger automatic deployment.

---

Last Updated: 2025-12-11
