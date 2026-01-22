import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { quotes } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import sgMail from "@sendgrid/mail"

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// SendGrid webhook event types we care about
type SendGridEvent = {
  email: string
  timestamp: number
  event: "processed" | "dropped" | "delivered" | "deferred" | "bounce" | "open" | "click" | "spam_report" | "unsubscribe"
  sg_message_id?: string
  sg_event_id?: string
  reason?: string
  category?: string[]
  useragent?: string
}

// Business notification email
const BUSINESS_EMAIL = "sales@dewaterproducts.com.au"
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@dewaterproducts.com.au"

/**
 * SendGrid Event Webhook
 *
 * Receives delivery events from SendGrid and notifies business owner
 * when customer emails are delivered or opened.
 *
 * Setup in SendGrid:
 * 1. Go to Settings > Mail Settings > Event Webhook
 * 2. Set HTTP Post URL to: https://dewaterproducts.com.au/api/webhooks/sendgrid
 * 3. Select events: Delivered, Opened, Bounced, Dropped
 * 4. Enable the webhook
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the webhook payload (array of events)
    const events: SendGridEvent[] = await request.json()

    if (!Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Process each event
    for (const event of events) {
      await processEvent(event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("SendGrid webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function processEvent(event: SendGridEvent) {
  const { email, event: eventType, timestamp, reason } = event

  // Skip business emails - we only care about customer emails
  if (email === BUSINESS_EMAIL || email === FROM_EMAIL) {
    return
  }

  // Find the most recent quote for this email address
  const [quote] = await db
    .select({
      id: quotes.id,
      quoteNumber: quotes.quoteNumber,
      companyName: quotes.companyName,
      contactName: quotes.contactName,
      email: quotes.email,
      createdAt: quotes.createdAt,
    })
    .from(quotes)
    .where(eq(quotes.email, email))
    .orderBy(desc(quotes.createdAt))
    .limit(1)

  if (!quote) {
    // No quote found for this email - might be contact form or other email
    console.log("SendGrid event for unknown email:", email, eventType)
    return
  }

  // Only notify for important events
  const eventTime = new Date(timestamp * 1000).toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
    dateStyle: "medium",
    timeStyle: "short",
  })

  switch (eventType) {
    case "delivered":
      await sendBusinessNotification({
        subject: "Quote " + quote.quoteNumber + " - Email Delivered",
        message: "The quote email was successfully delivered to " + quote.contactName + " (" + email + ") at " + eventTime + ".",
        quote,
        eventType: "delivered",
      })
      break

    case "open":
      await sendBusinessNotification({
        subject: "Quote " + quote.quoteNumber + " - Customer Opened Email",
        message: quote.contactName + " from " + quote.companyName + " opened the quote email at " + eventTime + ". This is a good time to follow up!",
        quote,
        eventType: "opened",
      })
      break

    case "click":
      await sendBusinessNotification({
        subject: "Quote " + quote.quoteNumber + " - Customer Clicked Link",
        message: quote.contactName + " from " + quote.companyName + " clicked a link in the quote email at " + eventTime + ". They are actively reviewing the quote!",
        quote,
        eventType: "clicked",
      })
      break

    case "bounce":
    case "dropped":
      await sendBusinessNotification({
        subject: "Quote " + quote.quoteNumber + " - Email FAILED to Deliver",
        message: "The quote email to " + quote.contactName + " (" + email + ") failed to deliver.\n\nReason: " + (reason || "Unknown") + "\n\nPlease contact the customer by phone: Check quote for phone number.",
        quote,
        eventType: "failed",
        isUrgent: true,
      })
      break

    default:
      // Log other events but don't notify
      console.log("SendGrid event:", eventType, email, quote.quoteNumber)
  }
}

async function sendBusinessNotification({
  subject,
  message,
  quote,
  eventType,
  isUrgent = false,
}: {
  subject: string
  message: string
  quote: {
    quoteNumber: string
    companyName: string
    contactName: string
    email: string
  }
  eventType: string
  isUrgent?: boolean
}) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("SendGrid not configured, skipping notification:", subject)
    return
  }

  const iconMap: Record<string, string> = {
    delivered: "&#x2705;",
    opened: "&#x1F440;",
    clicked: "&#x1F517;",
    failed: "&#x274C;",
  }
  const icon = iconMap[eventType] || "&#x1F4E7;"

  const htmlContent = buildNotificationEmail({
    icon,
    subject,
    message,
    quote,
    isUrgent,
  })

  try {
    await sgMail.send({
      to: BUSINESS_EMAIL,
      from: {
        email: FROM_EMAIL,
        name: "Dewater Products Quote System",
      },
      subject: (isUrgent ? " URGENT: " : "") + subject,
      html: htmlContent,
      text: message,
    })

    console.log("Business notification sent:", subject)
  } catch (error) {
    console.error("Failed to send business notification:", error)
  }
}

function buildNotificationEmail({
  icon,
  message,
  quote,
  isUrgent,
}: {
  icon: string
  subject: string
  message: string
  quote: {
    quoteNumber: string
    companyName: string
    contactName: string
    email: string
  }
  isUrgent: boolean
}) {
  const urgentBanner = isUrgent
    ? '<div style="background-color: #fee2e2; border: 2px solid #ef4444; color: #b91c1c; padding: 16px; border-radius: 8px; margin-bottom: 20px; font-weight: bold;">Action Required - Email delivery failed</div>'
    : ""

  const formattedMessage = message.replace(/\n/g, "<br>")

  const html = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '</head>',
    '<body style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background-color: #f8fafc; padding: 20px; margin: 0;">',
    '  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">',
    '    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); padding: 24px; text-align: center;">',
    '      <div style="font-size: 40px; margin-bottom: 8px;">' + icon + '</div>',
    '      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">Email Delivery Update</h1>',
    '    </div>',
    '    <div style="padding: 24px;">',
    urgentBanner,
    '      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">' + formattedMessage + '</p>',
    '      <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 20px;">',
    '        <h3 style="color: #0f172a; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Quote Details</h3>',
    '        <table style="width: 100%; font-size: 14px;">',
    '          <tr><td style="color: #64748b; padding: 4px 0;">Quote Number:</td><td style="color: #0f172a; font-weight: 600; padding: 4px 0;">' + quote.quoteNumber + '</td></tr>',
    '          <tr><td style="color: #64748b; padding: 4px 0;">Company:</td><td style="color: #0f172a; padding: 4px 0;">' + quote.companyName + '</td></tr>',
    '          <tr><td style="color: #64748b; padding: 4px 0;">Contact:</td><td style="color: #0f172a; padding: 4px 0;">' + quote.contactName + '</td></tr>',
    '          <tr><td style="color: #64748b; padding: 4px 0;">Email:</td><td style="color: #0f172a; padding: 4px 0;">' + quote.email + '</td></tr>',
    '        </table>',
    '      </div>',
    '      <div style="text-align: center;">',
    '        <a href="https://dewaterproducts.com.au/admin/quotes" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">View in Admin Dashboard</a>',
    '      </div>',
    '    </div>',
    '    <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">',
    '      <p style="color: #94a3b8; font-size: 12px; margin: 0;">Automated notification from Dewater Products Quote System</p>',
    '    </div>',
    '  </div>',
    '</body>',
    '</html>',
  ].join("\n")

  return html
}

// GET handler for webhook verification (SendGrid may ping this)
export async function GET() {
  return NextResponse.json({ status: "SendGrid webhook endpoint active" })
}
