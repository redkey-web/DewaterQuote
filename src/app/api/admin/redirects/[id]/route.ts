import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { redirects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { normalizePath, validateRedirectPaths, invalidateRedirectCache } from '@/lib/redirects';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check auth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const redirectId = parseInt(id, 10);
  if (isNaN(redirectId)) {
    return NextResponse.json({ error: 'Invalid redirect ID' }, { status: 400 });
  }

  try {
    const body = await request.json();

    const { fromPath, toPath, statusCode, isActive, productId, expiresAt } = body;

    // Validate paths
    const validationError = validateRedirectPaths(fromPath, toPath);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Validate status code
    const validStatusCode = statusCode === 302 ? 302 : 301;

    // Normalize paths
    const normalizedFromPath = normalizePath(fromPath);
    const normalizedToPath = toPath.startsWith('http') ? toPath : normalizePath(toPath);

    // Update redirect
    await db
      .update(redirects)
      .set({
        fromPath: normalizedFromPath,
        toPath: normalizedToPath,
        statusCode: validStatusCode,
        isActive: isActive !== false,
        productId: productId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .where(eq(redirects.id, redirectId));

    // Invalidate cache
    invalidateRedirectCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update redirect:', error);

    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A redirect from this path already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update redirect' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check auth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const redirectId = parseInt(id, 10);
  if (isNaN(redirectId)) {
    return NextResponse.json({ error: 'Invalid redirect ID' }, { status: 400 });
  }

  try {
    await db.delete(redirects).where(eq(redirects.id, redirectId));

    // Invalidate cache
    invalidateRedirectCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete redirect:', error);
    return NextResponse.json(
      { error: 'Failed to delete redirect' },
      { status: 500 }
    );
  }
}
