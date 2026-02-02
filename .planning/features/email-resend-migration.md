# Email Reliability - Migrate to Resend + Failure Tracking

**Created**: 2026-02-02
**Type**: fix/refactor
**Status**: Planning
**Related**: [[remove-sendgrid]] - Supersedes remaining incomplete tasks (Phase 4 env cleanup, Phase 6 testing)
**Related**: [[quote-system]] - Resolves Phase 6.2 manual testing blockers

## Summary

Replace nodemailer/SMTP with Resend HTTP API to eliminate transient SMTP connection failures in Vercel's serverless environment. Fix critical bug where email failures return `success: true` to customers. Add database-backed email delivery logging so failures are visible and actionable.

## Why

- SMTP on serverless is inherently unreliable (cold-start TCP/TLS overhead causes ~25% timeout rate per Vercel community reports)
- Current code silently swallows email failures and tells customers their quote was sent
- No way to audit which quotes actually had emails delivered
- Resend is HTTP-based (what serverless is built for), has native Next.js SDK, and handles SPF/DKIM domain verification

## Scope

- **Impact**: High (fixes customer-facing email delivery failures)
- **Files**: 4 to modify, 2 to create, 1 migration
- **Risk**: Low - `sendEmail()` interface preserved, callers unchanged

## Pre-Requisites (Manual Steps)

Before implementation:
1. Sign up at resend.com (free tier: 100 emails/day, 3,000/month)
2. Add domain `dewaterproducts.com.au` in Resend dashboard
3. Add the DNS records Resend provides (SPF, DKIM, DMARC) to domain DNS
4. Wait for domain verification (usually <5 minutes)
5. Generate API key in Resend dashboard

---

## Phases

### Phase 1: Database Schema - Email Tracking Fields

Add email delivery tracking columns to the `quotes` table so failures are persisted and queryable.

- [x] Add columns to `src/db/schema.ts` quotes table:
  - `customerEmailSentAt` (timestamp, nullable)
  - `businessEmailSentAt` (timestamp, nullable)
  - `emailFailureReason` (text, nullable)
- [x] Create `email_logs` table in `src/db/schema.ts`:
  - `id` (serial PK)
  - `quoteNumber` (text, nullable - not all emails are quotes)
  - `recipient` (text)
  - `subject` (text)
  - `status` (text: 'sent' | 'failed')
  - `errorMessage` (text, nullable)
  - `route` (text - which API route sent it)
  - `createdAt` (timestamp)
- [x] Run `npx drizzle-kit push` to apply migration
- [ ] **Test:** Verify new columns exist in Neon dashboard
  - *Hint: `SELECT column_name FROM information_schema.columns WHERE table_name = 'quotes' AND column_name LIKE '%email%'`*

### Phase 2: Swap nodemailer for Resend SDK

Replace the email client internals. The `sendEmail()` interface stays identical so no callers need changes.

- [x] Install Resend: `npm install resend`
- [x] Remove nodemailer: `npm uninstall nodemailer @types/nodemailer`
- [x] Rewrite `src/lib/email/client.ts`:
  - Import `Resend` from 'resend'
  - Map existing `EmailOptions` interface to Resend's `send()` params
  - Attachment format: `{ filename, content: Buffer }` (same as current)
  - Env check: `RESEND_API_KEY` instead of `SMTP_USER`/`SMTP_PASS`
  - Remove `verifyEmailConnection()` (unused, SMTP-specific)
- [ ] Add `RESEND_API_KEY` to Vercel env vars (Production + Preview)
- [x] **Test:** Build passes with no TypeScript errors
  - *Hint: `npm run build` - zero errors expected since interface unchanged*
- [x] **Test:** Verify all 6 callers still compile without changes
  - *Hint: `npx tsc --noEmit` - no caller should break since EmailOptions interface is preserved*

### Phase 3: Fix Critical Error Handling in Quote Route

Fix the silent failure bug and add proper delivery tracking.

- [x] Create `src/lib/email/logger.ts`:
  - `logEmailResult(params)` function that writes to `email_logs` table
  - Accepts: quoteNumber, recipient, subject, status, errorMessage, route
- [x] Fix `src/app/api/quote/route.ts` lines 867-906:
  - Replace `Promise.all()` with `Promise.allSettled()`
  - Track business email result independently from customer email result
  - On business email success: update `businessEmailSentAt` in quotes table
  - On customer email success: update `customerEmailSentAt` in quotes table
  - On ANY failure: set `emailFailureReason` in quotes table
  - Log each email result via `logEmailResult()`
  - If ALL emails fail: return `{ success: false, error: "..." }` with status 500
  - If customer email fails but business succeeds: return success with `emailWarning` field
- [ ] Fix `src/app/api/quote/route.ts` lines 839-842 (PDF failure):
  - Log PDF generation failure to `email_logs` table
  - Continue sending email but record `pdfAttached: false` context
- [x] Update SMTP config check (lines 220-231) to check `RESEND_API_KEY` instead of `SMTP_USER`/`SMTP_PASS`
- [ ] **Test:** Submit quote with valid data - both emails should log as 'sent'
  - *Hint: Check `email_logs` table has 2 rows with status='sent'*
- [ ] **Test:** Verify quote submission with `requiresReview=true` only sends business email
  - *Hint: `email_logs` should have 1 row (business only), quotes.customerEmailSentAt should be null*

### Phase 4: Vercel Environment Cleanup

- [ ] Add to Vercel (Production + Preview):
  - `RESEND_API_KEY`
- [ ] Remove from Vercel (Production + Preview):
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SENDGRID_API_KEY` (legacy leftover)
- [ ] Keep unchanged:
  - `FROM_EMAIL` (used in client.ts for sender address)
  - `FROM_NAME` (used in client.ts for sender name)
  - `CONTACT_EMAIL` (used for business notification recipient)
- [ ] Deploy to preview environment first
- [ ] **Test:** Send test quote on preview deployment
  - *Hint: Submit quote form, verify both business and customer emails arrive with PDF*
- [ ] **Test:** Send test contact form on preview deployment
  - *Hint: Submit contact form, verify both emails arrive*
- [ ] **Test:** Admin "Send to Customer" on preview deployment
  - *Hint: Go to /admin/quotes/{id}, click send, verify customer receives email with PDF*
- [ ] **Test:** Check emails not landing in spam
  - *Hint: Check spam folders on Gmail, Outlook, Yahoo test accounts*
- [ ] Deploy to production

### Phase 5: Verify & Close Legacy Plans

- [ ] Mark `remove-sendgrid.md` Phase 4 cleanup task as superseded (SENDGRID_API_KEY removed in Phase 4)
- [ ] Mark `remove-sendgrid.md` Phase 6 testing tasks as superseded (covered by Phase 4 tests above)
- [ ] Mark `quote-system.md` Phase 6.2 manual testing as superseded
- [x] Update `.env.example` to reflect new env vars

## Dependencies

- Resend account + verified domain (manual pre-requisite)
- DNS access for `dewaterproducts.com.au` (SPF/DKIM records)

## Files Changed

| File | Action | Change |
|------|--------|--------|
| `src/lib/email/client.ts` | Rewrite | nodemailer → Resend SDK |
| `src/lib/email/logger.ts` | Create | DB-backed email logging |
| `src/db/schema.ts` | Modify | Add email tracking fields + email_logs table |
| `src/app/api/quote/route.ts` | Modify | Fix error handling, add logging |
| `package.json` | Modify | +resend, -nodemailer, -@types/nodemailer |
| `.env.example` | Modify | Update env var documentation |

## Notes

- Resend attachment format accepts `Buffer` content directly (same as nodemailer) - no caller changes needed
- String concatenation used in email client (not template literals) due to known Write tool corruption issue
- The 5 other `sendEmail()` callers (contact, forgot-password, admin send, admin forward, approve-quote) require zero changes
- Free tier (100/day) is sufficient for current quote volume; upgrade to $20/month Pro if needed later
- `FROM_EMAIL` must match the verified domain in Resend
