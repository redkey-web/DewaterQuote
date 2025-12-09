import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
  const brandId = parseInt(id, 10);
  if (isNaN(brandId)) {
    return NextResponse.json({ error: 'Invalid brand ID' }, { status: 400 });
  }

  try {
    const body = await request.json();

    const { name, slug, description } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Update brand
    await db
      .update(brands)
      .set({
        name,
        slug,
        description: description || null,
      })
      .where(eq(brands.id, brandId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update brand:', error);

    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A brand with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update brand' },
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
  const brandId = parseInt(id, 10);
  if (isNaN(brandId)) {
    return NextResponse.json({ error: 'Invalid brand ID' }, { status: 400 });
  }

  try {
    await db.delete(brands).where(eq(brands.id, brandId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand. It may have products assigned.' },
      { status: 500 }
    );
  }
}
