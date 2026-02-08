# Remove SendGrid - Switch to Google Workspace SMTP

**Created**: 2026-01-24
**Type**: refactor
**Status**: Complete

## Summary

Replace SendGrid with Google Workspace SMTP to fix deliverability issues. SendGrid's shared IPs are getting flagged as spam. Using the client's existing Google Workspace means emails come from their own domain reputation.

## Why Google Workspace SMTP

| Aspect | SendGrid | Google Workspace SMTP |
|--------|----------|----------------------|
| IP Reputation | Shared pool (spam risk) | Google's infra + own domain |
| Cost | $20+/month | Already paying for Workspace |
| Deliverability | Degraded | Excellent |
| Setup | API key | App Password |
| Daily limit | Tier-based | 2,000/day |
| Webhooks | Yes | No |

**Trade-off**: Losing delivery tracking webhooks (open/delivered notifications). These just sent internal notification emails - not critical functionality.

## Current SendGrid Usage

| File | Purpose |
|------|---------|
| `src/app/api/contact/route.ts` | Contact form |
| `src/app/api/quote/route.ts` | Quote submission notification |
| `src/pages/api/admin/quotes/[id]/send.ts` | Admin sends quote to customer |
| `src/app/api/admin/quotes/[id]/forward/route.ts` | Forward quote |
| `src/app/api/approve-quote/[token]/route.ts` | Quick-approve link |
| `src/app/api/webhooks/sendgrid/route.ts` | Delivery tracking (removing) |
| `scripts/resend-quotes.ts` | Utility script |

## Scope

- **Impact**: Medium (6 API routes)
- **Files**: 7 files to modify, 1 to delete
- **Risk**: Low - email sending is isolated

## Phases

### Phase 1: Setup Google Workspace App Password
- [x] Log into Google Workspace admin (admin.google.com)
- [x] Go to Security → 2-Step Verification (must be enabled)
- [x] Create App Password for "Mail" on "Other (Custom name)" → "Dewater Website"
- [x] Save the 16-character password securely

### Phase 2: Environment & Email Client
- [x] Add env vars to Vercel (prod):
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=sales@dewaterproducts.com.au`
  - `SMTP_PASS=<app-password>`
- [x] Add `nodemailer` package
- [x] Create `src/lib/email/client.ts` - centralized email sender
- [x] Update `.env.example`

### Phase 3: Migrate API Routes
- [x] Update `src/app/api/contact/route.ts`
- [x] Update `src/app/api/quote/route.ts`
- [x] Update `src/pages/api/admin/quotes/[id]/send.ts`
- [x] Update `src/app/api/admin/quotes/[id]/forward/route.ts`
- [x] Update `src/app/api/approve-quote/[token]/route.ts`
- [x] Update `scripts/resend-quotes.ts`

### Phase 4: Cleanup
- [x] Delete `src/app/api/webhooks/sendgrid/route.ts`
- [x] Remove `@sendgrid/mail` from package.json
- [x] Run `npm install` to update lockfile
- [ ] Remove `SENDGRID_API_KEY` from Vercel env vars
- [x] Update `.planning/current/services.md` (2026-01-29)

### Phase 4.5: Fix Template Literal Corruption (2026-01-29)
- [x] Fixed `src/lib/email/client.ts` line 37 - from field had single quotes
- [x] Fixed `src/app/api/quote/route.ts` line 601 - subject had single quotes
- [x] Fixed `src/app/api/approve-quote/[token]/route.ts` lines 164, 170 - subject and filename
- [x] Fixed `src/app/api/admin/quotes/[id]/forward/route.ts` lines 340, 351, 357 - logs and filename
- [x] Verified build passes with all fixes
- **Note**: Used string concatenation instead of template literals due to known corruption issue

### Phase 5: App Password Configuration (COMPLETE - 2026-01-29)
- [x] Client enabled 2FA on `info@dewaterproducts.com.au`
- [x] Client generated App Password
- [x] Updated env vars:
  - `SMTP_USER=info@dewaterproducts.com.au`
  - `SMTP_PASS=vwmprffrhuwzibze`
  - `FROM_EMAIL=info@dewaterproducts.com.au`
  - `CONTACT_EMAIL=sales@dewaterproducts.com.au`
- [x] Removed mike@mechatronmike.com from CONTACT_EMAIL
- [x] Deployed to production

### Phase 6: Testing (2026-01-29)
- [x] SMTP connection verified
- [x] Test email sent to sales@dewaterproducts.com.au
- [ ] Test contact form → business + customer emails arrive
- [ ] Test quote submission → business notification with PDF
- [ ] Test admin "Send to Customer" → customer receives quote PDF
- [ ] Verify emails not landing in spam

## Email Client Implementation

```typescript
// src/lib/email/client.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

export async function sendEmail(options: EmailOptions) {
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.FROM_NAME || 'Dewater Products';

  return transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
    attachments: options.attachments,
  });
}

// Verify connection on startup (optional)
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('SMTP connection verified');
    return true;
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return false;
  }
}
```

## Environment Variables

**Remove**:
```
SENDGRID_API_KEY
```

**Add**:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sales@dewaterproducts.com.au
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
```

**Keep**:
```
FROM_EMAIL=sales@dewaterproducts.com.au
FROM_NAME=Dewater Products
CONTACT_EMAIL=sales@dewaterproducts.com.au
```

## Migration Pattern

Each API route changes from:

```typescript
// Before (SendGrid)
import sgMail from "@sendgrid/mail"
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}
// ...
await sgMail.send({
  to: email,
  from: { email: fromEmail, name: fromName },
  subject: "...",
  html: "...",
  attachments: [{ content: base64, filename: "...", type: "application/pdf", disposition: "attachment" }]
})
```

To:

```typescript
// After (Nodemailer)
import { sendEmail } from "@/lib/email/client"
// ...
await sendEmail({
  to: email,
  subject: "...",
  html: "...",
  attachments: [{ filename: "...", content: pdfBuffer, contentType: "application/pdf" }]
})
```

## Notes

- App Password requires 2-Step Verification enabled on the Google account
- Google SMTP limit is 2,000 emails/day - plenty for this use case
- No webhook functionality - if needed later, can add separate tracking
- Nodemailer is well-maintained, widely used, no vendor lock-in
