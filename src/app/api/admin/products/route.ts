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
} from '@/db/schema';

export async function POST(request: NextRequest) {
  // Check auth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Validate required fields
    if (!name || !sku || !brandId || !categoryId || !description || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name, sku, brandId, categoryId, description, slug' },
        { status: 400 }
      );
    }

    // Create product
    const [newProduct] = await db
      .insert(products)
      .values({
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
        priceVaries: priceVaries ?? true,
        priceNote: priceNote || null,
        basePrice: basePrice || null,
        isActive: isActive ?? true,
        materials: materials || null,
      })
      .returning({ id: products.id });

    const productId = newProduct.id;

    // Insert features
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

    // Insert specifications
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

    // Insert applications
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

    // Insert variations
    if (variations && variations.length > 0) {
      const variationInserts = variations
        .filter((v: { size: string; label: string }) => v.size.trim() && v.label.trim())
        .map((v: { size: string; label: string; price: string; sku: string }, i: number) => ({
          productId,
          size: v.size.trim(),
          label: v.label.trim(),
          price: v.price || null,
          sku: v.sku || null,
          displayOrder: i,
        }));
      if (variationInserts.length > 0) {
        await db.insert(productVariations).values(variationInserts);
      }
    }

    // Insert images
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

    // Insert downloads
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

    return NextResponse.json({ success: true, id: productId });
  } catch (error) {
    console.error('Failed to create product:', error);

    // Check for unique constraint violations
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A product with this slug or SKU already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
