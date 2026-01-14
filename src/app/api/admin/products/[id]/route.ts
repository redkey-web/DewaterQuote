import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/db';
import {
  products,
  productFeatures,
  productSpecifications,
  productApplications,
  productVariations,
  productImages,
  productDownloads,
  productCategories,
  productStock,
} from '@/db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

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
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const body = await request.json();

    const {
      name,
      shortName,
      slug,
      sku,
      brandId,
      categoryId,
      subcategoryId,
      categoryIds, // Multi-category support
      description,
      certifications,
      pressureRange,
      temperature,
      sizeFrom,
      leadTime,
      video,
      priceVaries,
      priceNote,
      basePrice,
      isActive,
      materials,
      features,
      specifications,
      applications,
      variations,
      images,
      downloads,
    } = body;

    // Update product
    await db
      .update(products)
      .set({
        name,
        shortName: shortName || null,
        slug,
        sku,
        brandId,
        categoryId,
        subcategoryId: subcategoryId || null,
        description,
        certifications: certifications || null,
        pressureRange: pressureRange || null,
        temperature: temperature || null,
        sizeFrom: sizeFrom || null,
        leadTime: leadTime || null,
        video: video || null,
        priceVaries,
        priceNote: priceNote || null,
        basePrice: basePrice || null,
        isActive,
        materials: materials || null,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    // Update features (delete all, insert new)
    await db.delete(productFeatures).where(eq(productFeatures.productId, productId));
    if (features && features.length > 0) {
      const featureInserts = features
        .filter((f: string) => f.trim())
        .map((f: string, i: number) => ({
          productId,
          feature: f.trim(),
          displayOrder: i,
        }));
      if (featureInserts.length > 0) {
        await db.insert(productFeatures).values(featureInserts);
      }
    }

    // Update specifications
    await db.delete(productSpecifications).where(eq(productSpecifications.productId, productId));
    if (specifications && specifications.length > 0) {
      const specInserts = specifications
        .filter((s: { label: string; value: string }) => s.label.trim() && s.value.trim())
        .map((s: { label: string; value: string }, i: number) => ({
          productId,
          label: s.label.trim(),
          value: s.value.trim(),
          displayOrder: i,
        }));
      if (specInserts.length > 0) {
        await db.insert(productSpecifications).values(specInserts);
      }
    }

    // Update applications
    await db.delete(productApplications).where(eq(productApplications.productId, productId));
    if (applications && applications.length > 0) {
      const appInserts = applications
        .filter((a: string) => a.trim())
        .map((a: string, i: number) => ({
          productId,
          application: a.trim(),
          displayOrder: i,
        }));
      if (appInserts.length > 0) {
        await db.insert(productApplications).values(appInserts);
      }
    }

    // Update variations - use displayOrder from form, not array index
    await db.delete(productVariations).where(eq(productVariations.productId, productId));
    if (variations && variations.length > 0) {
      const variationInserts = variations
        .filter((v: { size: string; label: string }) => v.size.trim() && v.label.trim())
        .map((v: { size: string; label: string; price: string; sku: string; source?: string; displayOrder?: number }, i: number) => ({
          productId,
          size: v.size.trim(),
          label: v.label.trim(),
          price: v.price || null,
          sku: v.sku || null,
          source: v.source || 'manual',
          displayOrder: v.displayOrder ?? i * 100, // Use provided displayOrder or fallback to i*100 for gap numbering
        }));
      if (variationInserts.length > 0) {
        await db.insert(productVariations).values(variationInserts);

        // Handle stock for each variation
        // First, fetch the newly inserted variations to get their IDs
        const newVariations = await db.query.productVariations.findMany({
          where: eq(productVariations.productId, productId),
        });

        // Delete old variation-level stock (we'll recreate based on form data)
        await db.delete(productStock).where(
          and(
            eq(productStock.productId, productId),
            isNotNull(productStock.variationId)
          )
        );

        // Create stock records for variations that have stock values
        const stockInserts = [];
        for (const formVar of variations) {
          if (formVar.stock !== undefined && formVar.stock !== null) {
            // Find the matching new variation by size
            const matchingVar = newVariations.find((nv) => nv.size === formVar.size.trim());
            if (matchingVar) {
              stockInserts.push({
                productId,
                variationId: matchingVar.id,
                qtyInStock: parseInt(String(formVar.stock), 10) || 0,
                lastUpdatedAt: new Date(),
              });
            }
          }
        }
        if (stockInserts.length > 0) {
          await db.insert(productStock).values(stockInserts);
        }
      }
    }

    // Update images
    await db.delete(productImages).where(eq(productImages.productId, productId));
    if (images && images.length > 0) {
      const imageInserts = images
        .filter((i: { url: string }) => i.url)
        .map((i: { url: string; alt: string; isPrimary: boolean }, idx: number) => ({
          productId,
          url: i.url,
          alt: i.alt || '',
          isPrimary: i.isPrimary ?? false,
          displayOrder: idx,
        }));
      if (imageInserts.length > 0) {
        await db.insert(productImages).values(imageInserts);
      }
    }

    // Update downloads
    await db.delete(productDownloads).where(eq(productDownloads.productId, productId));
    if (downloads && downloads.length > 0) {
      const downloadInserts = downloads
        .filter((d: { url: string }) => d.url)
        .map((d: { url: string; label: string; fileType: string; fileSize: number }) => ({
          productId,
          url: d.url,
          label: d.label || 'Download',
          fileType: d.fileType || 'pdf',
          fileSize: d.fileSize || 0,
        }));
      if (downloadInserts.length > 0) {
        await db.insert(productDownloads).values(downloadInserts);
      }
    }

    // Update product categories (multi-category support)
    await db.delete(productCategories).where(eq(productCategories.productId, productId));
    if (categoryIds && categoryIds.length > 0) {
      const categoryInserts = (categoryIds as number[]).map((catId: number, idx: number) => ({
        productId,
        categoryId: catId,
        displayOrder: idx,
      }));
      await db.insert(productCategories).values(categoryInserts);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
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
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    // Delete related records first (cascade should handle this, but being explicit)
    await db.delete(productFeatures).where(eq(productFeatures.productId, productId));
    await db.delete(productSpecifications).where(eq(productSpecifications.productId, productId));
    await db.delete(productApplications).where(eq(productApplications.productId, productId));
    await db.delete(productVariations).where(eq(productVariations.productId, productId));
    await db.delete(productImages).where(eq(productImages.productId, productId));
    await db.delete(productDownloads).where(eq(productDownloads.productId, productId));

    // Delete the product
    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
