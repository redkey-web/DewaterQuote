import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { productVideos, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// GET /api/admin/products/[id]/videos - List all videos for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const videos = await db.query.productVideos.findMany({
      where: eq(productVideos.productId, productId),
      orderBy: (pv, { desc, asc }) => [desc(pv.isPrimary), asc(pv.displayOrder)],
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

// POST /api/admin/products/[id]/videos - Add a new video
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await request.json();
    const { youtubeId, title, sizeLabel, variationId } = body;

    if (!youtubeId || typeof youtubeId !== 'string') {
      return NextResponse.json({ error: 'YouTube ID is required' }, { status: 400 });
    }

    // Check if video already exists for this product
    const existing = await db.query.productVideos.findFirst({
      where: and(
        eq(productVideos.productId, productId),
        eq(productVideos.youtubeId, youtubeId)
      ),
    });

    if (existing) {
      return NextResponse.json({ error: 'Video already exists for this product' }, { status: 400 });
    }

    // Check if this is the first video (make it primary)
    const existingCount = await db.query.productVideos.findMany({
      where: eq(productVideos.productId, productId),
    });
    const isPrimary = existingCount.length === 0;

    // Insert the video
    const [newVideo] = await db.insert(productVideos).values({
      productId,
      youtubeId,
      title: title || null,
      sizeLabel: sizeLabel || null,
      variationId: variationId || null,
      isPrimary,
      isActive: true, // New videos are active by default
      displayOrder: existingCount.length,
    }).returning();

    // If this is the primary video, update the product.video field
    if (isPrimary) {
      await db
        .update(products)
        .set({ video: `https://www.youtube.com/watch?v=${youtubeId}` })
        .where(eq(products.id, productId));
    }

    return NextResponse.json({ video: newVideo });
  } catch (error) {
    console.error('Error adding video:', error);
    return NextResponse.json({ error: 'Failed to add video' }, { status: 500 });
  }
}
