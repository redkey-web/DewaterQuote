import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { productVideos, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// PATCH /api/admin/products/[id]/videos/[videoId] - Toggle video active state
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, videoId } = await params;
    const productId = parseInt(id, 10);
    const videoIdNum = parseInt(videoId, 10);

    if (isNaN(productId) || isNaN(videoIdNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Get current video state
    const video = await db.query.productVideos.findFirst({
      where: and(
        eq(productVideos.id, videoIdNum),
        eq(productVideos.productId, productId)
      ),
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Toggle isActive
    const newActiveState = !video.isActive;

    await db
      .update(productVideos)
      .set({ isActive: newActiveState })
      .where(eq(productVideos.id, videoIdNum));

    return NextResponse.json({
      success: true,
      isActive: newActiveState
    });
  } catch (error) {
    console.error('Error toggling video active state:', error);
    return NextResponse.json({ error: 'Failed to toggle video' }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]/videos/[videoId] - Delete a video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, videoId } = await params;
    const productId = parseInt(id, 10);
    const videoIdNum = parseInt(videoId, 10);

    if (isNaN(productId) || isNaN(videoIdNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Get the video to check if it's primary
    const video = await db.query.productVideos.findFirst({
      where: and(
        eq(productVideos.id, videoIdNum),
        eq(productVideos.productId, productId)
      ),
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const wasPrimary = video.isPrimary;

    // Delete the video
    await db.delete(productVideos).where(eq(productVideos.id, videoIdNum));

    // If it was primary, set the next video as primary
    if (wasPrimary) {
      const nextVideo = await db.query.productVideos.findFirst({
        where: eq(productVideos.productId, productId),
        orderBy: (pv, { asc }) => [asc(pv.displayOrder)],
      });

      if (nextVideo) {
        await db
          .update(productVideos)
          .set({ isPrimary: true })
          .where(eq(productVideos.id, nextVideo.id));

        // Update product.video field
        await db
          .update(products)
          .set({ video: `https://www.youtube.com/watch?v=${nextVideo.youtubeId}` })
          .where(eq(products.id, productId));
      } else {
        // No more videos, clear the product.video field
        await db
          .update(products)
          .set({ video: null })
          .where(eq(products.id, productId));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
