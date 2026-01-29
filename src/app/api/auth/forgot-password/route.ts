import { NextResponse } from 'next/server';
import { db } from '@/db';
import { adminUsers, passwordResetTokens } from '@/db/schema';
import { eq, and, gt, isNull } from 'drizzle-orm';
import { sendEmail } from '@/lib/email/client';
import crypto from 'crypto';

// Rate limiting: Track requests per IP (in-memory, resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // Max requests per window
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = (forwarded ? forwarded.split(',')[0] : null) ||
               request.headers.get('x-real-ip') ||
               'unknown';

    if (isRateLimited(ip)) {
      // Return same response as success to not reveal rate limiting
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user (but don't reveal if they exist)
    const user = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.email, normalizedEmail),
    });

    // Always return success to prevent email enumeration
    if (!user) {
      console.log('[Password Reset] No user found for email:', normalizedEmail);
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    // Invalidate any existing unused tokens for this user
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(passwordResetTokens.userId, user.id),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      );

    // Generate secure token (32 bytes = 64 hex characters)
    const token = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing (so DB leak doesn't expose tokens)
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Store hashed token
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // Send reset email
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://dewaterproducts.com.au';
    const resetUrl = baseUrl + '/admin/reset-password?token=' + token;

    const greeting = user.name ? 'Hello ' + user.name + ',' : 'Hello,';

    const htmlContent = [
      '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">',
      '  <div style="background: #0ea5e9; color: white; padding: 20px; text-align: center;">',
      '    <h1 style="margin: 0;">Dewater Products</h1>',
      '  </div>',
      '  <div style="padding: 30px; background: #ffffff;">',
      '    <h2 style="color: #1a1a1a; margin-top: 0;">Password Reset Request</h2>',
      '    <p>' + greeting + '</p>',
      '    <p>We received a request to reset your password for the Dewater Products admin panel.</p>',
      '    <p>Click the button below to reset your password:</p>',
      '    <div style="text-align: center; margin: 30px 0;">',
      '      <a href="' + resetUrl + '"',
      '         style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">',
      '        Reset Password',
      '      </a>',
      '    </div>',
      '    <p style="color: #666; font-size: 14px;">',
      '      This link will expire in <strong>1 hour</strong>.',
      '    </p>',
      '    <p style="color: #666; font-size: 14px;">',
      '      If you did not request this password reset, you can safely ignore this email.',
      '      Your password will not be changed.',
      '    </p>',
      '    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />',
      '    <p style="color: #999; font-size: 12px;">',
      '      If the button does not work, copy and paste this link into your browser:<br />',
      '      <a href="' + resetUrl + '" style="color: #0ea5e9; word-break: break-all;">' + resetUrl + '</a>',
      '    </p>',
      '  </div>',
      '  <div style="padding: 20px; background: #f5f5f5; text-align: center; color: #666; font-size: 12px;">',
      '    Dewater Products Admin Panel',
      '  </div>',
      '</div>',
    ].join('\n');

    const textContent = [
      'Password Reset Request',
      '',
      greeting,
      '',
      'We received a request to reset your password for the Dewater Products admin panel.',
      '',
      'Click this link to reset your password:',
      resetUrl,
      '',
      'This link will expire in 1 hour.',
      '',
      'If you did not request this password reset, you can safely ignore this email.',
      '',
      'Dewater Products Admin Panel',
    ].join('\n');

    await sendEmail({
      to: user.email,
      subject: 'Password Reset - Dewater Products Admin',
      html: htmlContent,
      text: textContent,
    });

    console.log('[Password Reset] Email sent to:', normalizedEmail);

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  } catch (error) {
    console.error('[Password Reset] Error:', error);
    // Don't reveal internal errors
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  }
}
