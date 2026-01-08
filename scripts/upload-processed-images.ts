/**
 * Upload Processed Images to Vercel Blob
 *
 * This script uploads background-removed images from output/ directory
 * to Vercel Blob and updates the database with new URLs
 *
 * Usage:
 *   # Dry run (shows what will be uploaded)
 *   npx tsx --env-file=.env.local scripts/upload-processed-images.ts
 *
 *   # Actually upload and update database
 *   npx tsx --env-file=.env.local scripts/upload-processed-images.ts --upload
 */

import { readdir, readFile } from "fs/promises"
import { join } from "path"
import { put, del } from "@vercel/blob"
import { db } from "@/db"
import { productImages } from "@/db/schema"
import { eq } from "drizzle-orm"

interface ProcessedImage {
  filename: string
  originalFilename: string
  localPath: string
  currentUrl?: string
  productName?: string
  imageId?: number
}

async function findMatchingImage(originalFilename: string) {
  // Get all products with images
  const allProducts = await db.query.products.findMany({
    with: {
      images: true,
    },
  })

  // Find matching image by URL pattern
  for (const product of allProducts) {
    for (const image of product.images) {
      if (image.url.includes(originalFilename)) {
        return {
          productName: product.name,
          imageId: image.id,
          currentUrl: image.url,
        }
      }
    }
  }

  return null
}

async function getProcessedImages(): Promise<ProcessedImage[]> {
  const outputDir = join(process.cwd(), "output")

  try {
    const files = await readdir(outputDir)
    const processedImages: ProcessedImage[] = []

    for (const filename of files) {
      if (!filename.endsWith("-no-bg.png")) continue

      // Extract original filename (remove -no-bg.png suffix)
      const originalFilename = filename.replace("-no-bg.png", "")

      const localPath = join(outputDir, filename)
      const match = await findMatchingImage(originalFilename)

      processedImages.push({
        filename,
        originalFilename,
        localPath,
        currentUrl: match?.currentUrl,
        productName: match?.productName,
        imageId: match?.imageId,
      })
    }

    return processedImages
  } catch (error) {
    console.error("Error reading output directory:", error)
    return []
  }
}

async function uploadAndUpdate(isDryRun: boolean = true) {
  console.log("🔍 Scanning output/ directory for processed images...\n")

  const processedImages = await getProcessedImages()

  if (processedImages.length === 0) {
    console.log("❌ No processed images found in output/ directory")
    console.log("\n💡 Run the background removal script first:")
    console.log("   python scripts/remove-backgrounds.py --urls \"...\" --process")
    return
  }

  console.log(`📊 Found ${processedImages.length} processed images\n`)

  if (isDryRun) {
    console.log("🧪 DRY RUN MODE - No uploads or database changes\n")

    processedImages.forEach((img, idx) => {
      console.log(`${idx + 1}. ${img.filename}`)
      if (img.productName) {
        console.log(`   Product: ${img.productName}`)
        console.log(`   Current URL: ${img.currentUrl}`)
        console.log(`   Will upload as: products/${img.filename}`)
      } else {
        console.log(`   ⚠️  No matching product found`)
      }
      console.log()
    })

    console.log("\n💡 Run with --upload to actually upload and update database")
    return
  }

  console.log("🚀 Starting upload process...\n")

  let uploaded = 0
  let failed = 0
  let skipped = 0

  for (const img of processedImages) {
    console.log(`Processing: ${img.filename}`)

    if (!img.imageId) {
      console.log(`  ⚠️  Skipped - no matching product found`)
      skipped++
      continue
    }

    try {
      // Read file
      const fileBuffer = await readFile(img.localPath)

      // Upload to Vercel Blob
      const blob = await put(`products/${img.filename}`, fileBuffer, {
        access: "public",
        contentType: "image/png",
        cacheControlMaxAge: 31536000, // 1 year
      })

      console.log(`  ✅ Uploaded: ${blob.url}`)

      // Update database
      await db.update(productImages).set({ url: blob.url }).where(eq(productImages.id, img.imageId))

      console.log(`  ✅ Database updated`)

      // Delete old blob if it was on Vercel
      if (img.currentUrl && img.currentUrl.includes("blob.vercel-storage.com")) {
        try {
          await del(img.currentUrl)
          console.log(`  🗑️  Deleted old blob`)
        } catch (e) {
          console.log(`  ⚠️  Could not delete old blob (may not exist)`)
        }
      }

      uploaded++
    } catch (error) {
      console.error(`  ❌ Failed:`, error)
      failed++
    }

    console.log()
  }

  console.log("✨ Done!")
  console.log(`   Uploaded: ${uploaded}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Skipped: ${skipped}`)

  if (uploaded > 0) {
    console.log("\n🎉 Images successfully updated! Check your website to see the changes.")
  }
}

// Run script
const isDryRun = !process.argv.includes("--upload")
uploadAndUpdate(isDryRun).catch(console.error)
