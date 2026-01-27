import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
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
    content: Buffer | string;
    contentType?: string;
    encoding?: 'base64';
  }>;
}

export async function sendEmail(options: EmailOptions) {
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'sales@dewaterproducts.com.au';
  const fromName = process.env.FROM_NAME || 'Dewater Products';

  // Check SMTP configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP not configured: SMTP_USER and SMTP_PASS required');
  }

  return transporter.sendMail({
    from: '"${fromName}" <${fromEmail}>',
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
    attachments: options.attachments?.map(att => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType,
      encoding: att.encoding,
    })),
  });
}

// Verify connection (optional - for debugging)
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
