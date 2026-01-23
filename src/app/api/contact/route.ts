import { NextRequest, NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"
import { escapeHtml, escapeEmailHref, escapeTelHref } from "@/lib/sanitize"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { verifyTurnstileToken } from "@/lib/turnstile"

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  turnstileToken?: string
}

export async function POST(request: NextRequest) {
  // Check rate limit first
  const ip = getClientIp(request)
  const rateLimitResponse = await checkRateLimit(ip)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const data: ContactFormData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Verify Turnstile token (if configured)
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!data.turnstileToken) {
        return NextResponse.json(
          { error: "Please complete the verification challenge" },
          { status: 400 }
        )
      }

      const verification = await verifyTurnstileToken(data.turnstileToken, ip)
      if (!verification.success) {
        return NextResponse.json(
          { error: verification.error || "Verification failed" },
          { status: 400 }
        )
      }
    }

    // Check for SendGrid API key
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not configured")
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    // Support multiple recipients (comma-separated)
    const toEmails = (process.env.CONTACT_EMAIL || "sales@dewaterproducts.com.au")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean)
    // SendGrid requires sender identity to match verified sender exactly
    const fromEmail = process.env.FROM_EMAIL || "sales@dewaterproducts.com.au"
    const fromName = process.env.FROM_NAME || "Dewater Products"

    // Sanitize all user inputs for HTML context
    const safeName = escapeHtml(data.name)
    const safeEmail = escapeHtml(data.email)
    const safeEmailHref = escapeEmailHref(data.email)
    const safePhone = data.phone ? escapeHtml(data.phone) : ""
    const safePhoneHref = data.phone ? escapeTelHref(data.phone) : ""
    const safeCompany = data.company ? escapeHtml(data.company) : ""
    const safeMessage = escapeHtml(data.message)

    // Email to business (supports multiple recipients)
    const businessEmail = {
      to: toEmails,
      from: {
        email: fromEmail,
        name: fromName,
      },
      replyTo: data.email,
      subject: `Contact Form: ${data.name}${data.company ? ` from ${data.company}` : ""}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${safeEmailHref}">${safeEmail}</a></td>
          </tr>
          ${safePhone ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${safePhoneHref}">${safePhone}</a></td>
          </tr>
          ` : ""}
          ${safeCompany ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Company</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeCompany}</td>
          </tr>
          ` : ""}
        </table>
        <h3 style="margin-top: 20px;">Message</h3>
        <div style="padding: 15px; background: #f5f5f5; border-radius: 5px; white-space: pre-wrap;">${safeMessage}</div>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
          Sent from Dewater Products website contact form
        </p>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}
${data.company ? `Company: ${data.company}` : ""}

Message:
${data.message}
      `.trim(),
    }

    // Confirmation email to customer
    const customerEmail = {
      to: data.email,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: "Thank you for contacting Dewater Products",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Thank you for your enquiry</h2>
          <p>Hi ${safeName},</p>
          <p>We've received your message and will get back to you within 1-2 business days.</p>
          <p>If you have an urgent enquiry, please call us on <strong>1300 271 290</strong>.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #666;">Your Message</h3>
          <div style="padding: 15px; background: #f5f5f5; border-radius: 5px; white-space: pre-wrap;">${safeMessage}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">
            <strong>Dewater Products Pty Ltd</strong><br />
            Phone: 1300 271 290<br />
            Email: sales@dewaterproducts.com.au<br />
            Perth, Western Australia
          </p>
        </div>
      `,
    }

    // Send both emails
    await Promise.all([
      sgMail.send(businessEmail),
      sgMail.send(customerEmail),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}
