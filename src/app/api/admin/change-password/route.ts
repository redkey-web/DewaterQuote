import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

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

export async function POST(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    // Validate inputs
    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New passwords do not match' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Don't allow same password
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    // Get current user
    const user = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.id, parseInt(session.user.id)),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password (use cost factor of 12 for good security)
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await db
      .update(adminUsers)
      .set({ passwordHash })
      .where(eq(adminUsers.id, user.id));

    console.log('[Change Password] Password updated for user:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Password has been changed successfully.',
    });
  } catch (error) {
    console.error('[Change Password] Error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
