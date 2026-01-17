import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { redirects } from '@/db/schema';
import { normalizePath, validateRedirectPaths, invalidateRedirectCache } from '@/lib/redirects';

export async function POST(request: NextRequest) {
  // Check auth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Normalize fromPath for storage
    const normalizedFromPath = normalizePath(fromPath);
    const normalizedToPath = toPath.startsWith('http') ? toPath : normalizePath(toPath);

    // Create redirect
    const [newRedirect] = await db
      .insert(redirects)
      .values({
        fromPath: normalizedFromPath,
        toPath: normalizedToPath,
        statusCode: validStatusCode,
        isActive: isActive !== false, // Default to true
        productId: productId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning({ id: redirects.id });

    // Invalidate cache
    invalidateRedirectCache();

    return NextResponse.json({ success: true, id: newRedirect.id });
  } catch (error) {
    console.error('Failed to create redirect:', error);

    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A redirect from this path already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create redirect' },
      { status: 500 }
    );
  }
}
