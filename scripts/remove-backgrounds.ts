/**
 * Background Removal Script for Product Images
 *
 * This script removes backgrounds from product images using remove.bg API
 *
 * Usage:
 *   npx tsx scripts/remove-backgrounds.ts
 *
 * Requirements:
 *   - REMOVE_BG_API_KEY environment variable
 *   - Or use free Python rembg library (see remove-backgrounds.py)
 */

import { db } from "@/db"
import { products, productImages } from "@/db/schema"
import { put, del } from "@vercel/blob"
import fetch from "node-fetch"

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY

interface ImageToProcess {
  productId: number
  productName: string
  imageId: number
  imageUrl: string
}

async function removeBackground(imageUrl: string): Promise<Buffer | null> {
  if (!REMOVE_BG_API_KEY) {
    console.error("❌ REMOVE_BG_API_KEY not set. Get a free key at https://remove.bg/api")
    console.log("💡 Or use the Python script (scripts/remove-backgrounds.py) which is free")
    return null
  }

  try {
    const formData = new FormData()
    formData.append("image_url", imageUrl)
    formData.append("size", "auto")

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to remove background: ${errorText}`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error("Error removing background:", error)
    return null
  }
}

async function processImages(dryRun: boolean = true) {
  console.log("🔍 Fetching product images...")

  // Get all product images
  const allProducts = await db.query.products.findMany({
    with: {
      images: true,
    },
  })

  const imagesToProcess: ImageToProcess[] = []

  for (const product of allProducts) {
    for (const image of product.images) {
      if (image.url && image.type === "image") {
        imagesToProcess.push({
          productId: product.id,
          productName: product.name,
          imageId: image.id,
          imageUrl: image.url,
        })
      }
    }
  }

  console.log(`\n📊 Found ${imagesToProcess.length} images to process`)

  if (dryRun) {
    console.log("\n🧪 DRY RUN MODE - No images will be modified")
    console.log("\nImages to process:")
    imagesToProcess.forEach((img, idx) => {
      console.log(`  ${idx + 1}. ${img.productName}`)
      console.log(`     URL: ${img.imageUrl}`)
    })
    console.log("\n💡 Run with --process to actually remove backgrounds")
    return
  }

  console.log("\n🚀 Starting background removal...\n")

  let processed = 0
  let failed = 0

  for (const img of imagesToProcess) {
    console.log(`Processing: ${img.productName}...`)

    // Remove background
    const processedImageBuffer = await removeBackground(img.imageUrl)

    if (!processedImageBuffer) {
      console.log(`  ❌ Failed to process`)
      failed++
      continue
    }

    // Upload to Vercel Blob
    const filename = img.imageUrl.split('/').pop() || `product-${img.productId}.png`
    const newFilename = filename.replace(/\.[^.]+$/, '-no-bg.png')

    try {
      const blob = await put(`products/${newFilename}`, processedImageBuffer, {
        access: "public",
        contentType: "image/png",
      })

      // Update database with new URL
      await db
        .update(productImages)
        .set({ url: blob.url })
        .where(productImages.id.eq(img.imageId))

      // Delete old blob if it was on Vercel
      if (img.imageUrl.includes('blob.vercel-storage.com')) {
        try {
          await del(img.imageUrl)
        } catch (e) {
          console.log(`  ⚠️  Could not delete old blob`)
        }
      }

      console.log(`  ✅ Processed: ${blob.url}`)
      processed++
    } catch (error) {
      console.error(`  ❌ Upload failed:`, error)
      failed++
    }

    // Rate limit: wait 1 second between requests (remove.bg free tier)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`\n✨ Done!`)
  console.log(`   Processed: ${processed}`)
  console.log(`   Failed: ${failed}`)
}

// Run script
const isDryRun = !process.argv.includes("--process")
processImages(isDryRun).catch(console.error)
