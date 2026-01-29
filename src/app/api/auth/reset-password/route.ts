import { NextResponse } from 'next/server';
import { db } from '@/db';
import { adminUsers, passwordResetTokens } from '@/db/schema';
import { eq, and, gt, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Password requirements
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: 'Password must be at least ' + MIN_PASSWORD_LENGTH + ' characters' };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    };
  }

  return { valid: true };
}

// Constant-time comparison to prevent timing attacks
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(request: Request) {
  try {
    const { token, password, confirmPassword } = await request.json();

    // Validate inputs
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid reset link' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Hash the provided token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid token
    const resetToken = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, new Date())
      ),
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Get the user
    const user = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.id, resetToken.userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 400 }
      );
    }

    // Hash new password (use cost factor of 12 for good security)
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and mark token as used (in a transaction-like manner)
    await db
      .update(adminUsers)
      .set({ passwordHash })
      .where(eq(adminUsers.id, user.id));

    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, resetToken.id));

    console.log('[Password Reset] Password updated for user:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('[Password Reset] Error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
