import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { categories } from '@/db/schema';

export async function POST(request: NextRequest) {
  // Check auth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { name, slug, description, longDescription, displayOrder } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Create category
    const [newCategory] = await db
      .insert(categories)
      .values({
        name,
        slug,
        description: description || null,
        longDescription: longDescription || null,
        displayOrder: displayOrder ?? 0,
      })
      .returning({ id: categories.id });

    return NextResponse.json({ success: true, id: newCategory.id });
  } catch (error) {
    console.error('Failed to create category:', error);

    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
