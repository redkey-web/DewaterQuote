import { Resend } from 'resend';

// Lazy initialize Resend client to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
    encoding?: 'base64';
  }>;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send email with explicit result (doesn't throw)
 * Use this when you need to handle success/failure individually
 */
export async function sendEmailSafe(options: EmailOptions): Promise<SendEmailResult> {
  const fromEmail = process.env.FROM_EMAIL || 'sales@dewaterproducts.com.au';
  const fromName = process.env.FROM_NAME || 'Dewater Products';

  const resend = getResendClient();

  // Check Resend API key configuration
  if (!resend) {
    const errorMsg = 'Email not configured: RESEND_API_KEY required';
    console.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    // Map attachments to Resend format
    const resendAttachments = options.attachments?.map(att => {
      // Handle Buffer content directly
      if (Buffer.isBuffer(att.content)) {
        return {
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        };
      }
      // Handle base64-encoded string content
      if (att.encoding === 'base64' && typeof att.content === 'string') {
        return {
          filename: att.filename,
          content: Buffer.from(att.content, 'base64'),
          contentType: att.contentType,
        };
      }
      // Handle plain string content
      return {
        filename: att.filename,
        content: Buffer.from(att.content as string),
        contentType: att.contentType,
      };
    });

    const { data, error } = await resend.emails.send({
      from: fromName + ' <' + fromEmail + '>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      attachments: resendAttachments,
    });

    if (error) {
      console.error('Resend email failed:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown email error';
    console.error('Email send error:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Send email (throws on failure for backward compatibility)
 * This is the original interface - callers can use try/catch
 */
export async function sendEmail(options: EmailOptions): Promise<{ id?: string }> {
  const result = await sendEmailSafe(options);

  if (!result.success) {
    throw new Error(result.error || 'Email send failed');
  }

  return { id: result.id };
}
