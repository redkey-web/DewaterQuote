import { db } from '@/db';
import { emailLogs } from '@/db/schema';

interface LogEmailParams {
  quoteNumber?: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed';
  errorMessage?: string;
  route: string;
}

/**
 * Log email send result to database for audit trail
 */
export async function logEmailResult(params: LogEmailParams): Promise<void> {
  try {
    await db.insert(emailLogs).values({
      quoteNumber: params.quoteNumber || null,
      recipient: params.recipient,
      subject: params.subject,
      status: params.status,
      errorMessage: params.errorMessage || null,
      route: params.route,
    });
  } catch (err) {
    // Log to console but don't throw - email logging shouldn't break the main flow
    console.error('Failed to log email result:', err);
  }
}
