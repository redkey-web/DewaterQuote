import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import { categories, subcategories } from '@/db/schema';
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
  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
  }

  try {
    const body = await request.json();

    const {
      name,
      slug,
      description,
      longDescription,
      displayOrder,
      subcategories: subcatData,
    } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Update category
    await db
      .update(categories)
      .set({
        name,
        slug,
        description: description || null,
        longDescription: longDescription || null,
        displayOrder: displayOrder ?? 0,
      })
      .where(eq(categories.id, categoryId));

    // Handle subcategories
    if (subcatData !== undefined) {
      // Get existing subcategory IDs
      const existingSubcats = await db
        .select({ id: subcategories.id })
        .from(subcategories)
        .where(eq(subcategories.categoryId, categoryId));
      const existingIds = new Set(existingSubcats.map((s) => s.id));

      // Separate new vs existing
      const toUpdate = subcatData.filter((s: { id?: number }) => s.id && existingIds.has(s.id));
      const toCreate = subcatData.filter((s: { id?: number }) => !s.id);
      const keepIds = new Set(toUpdate.map((s: { id: number }) => s.id));
      const toDelete = [...existingIds].filter((id) => !keepIds.has(id));

      // Delete removed subcategories
      for (const id of toDelete) {
        await db.delete(subcategories).where(eq(subcategories.id, id));
      }

      // Update existing subcategories
      for (const subcat of toUpdate) {
        await db
          .update(subcategories)
          .set({
            name: subcat.name,
            slug: subcat.slug,
            description: subcat.description || null,
            displayOrder: subcat.displayOrder ?? 0,
          })
          .where(eq(subcategories.id, subcat.id));
      }

      // Create new subcategories
      for (const subcat of toCreate) {
        await db.insert(subcategories).values({
          categoryId,
          name: subcat.name,
          slug: subcat.slug,
          description: subcat.description || null,
          displayOrder: subcat.displayOrder ?? 0,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update category:', error);

    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A category or subcategory with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update category' },
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
  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
  }

  try {
    // Delete category (subcategories will be cascade deleted by FK)
    await db.delete(categories).where(eq(categories.id, categoryId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category. It may have products assigned.' },
      { status: 500 }
    );
  }
}
