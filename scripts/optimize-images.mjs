import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

const INPUT_DIR = './public/images/products/neto-download'
const OUTPUT_DIR = './public/images/products/optimized'
const MAX_WIDTH = 1200
const JPEG_QUALITY = 80
const PNG_QUALITY = 80

async function optimizeImages() {
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  // Get all image files
  const files = await fs.readdir(INPUT_DIR)
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f))

  console.log(`\nOptimizing ${imageFiles.length} images...`)
  console.log(`Max width: ${MAX_WIDTH}px, JPEG quality: ${JPEG_QUALITY}%\n`)

  let totalOriginal = 0
  let totalOptimized = 0
  let processed = 0

  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file)
    const outputPath = path.join(OUTPUT_DIR, file.replace(/\.png$/i, '.jpg'))

    try {
      const originalStats = await fs.stat(inputPath)
      totalOriginal += originalStats.size

      // Process image: resize if wider than MAX_WIDTH, convert to JPEG, compress
      await sharp(inputPath)
        .resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: JPEG_QUALITY, progressive: true })
        .toFile(outputPath)

      const optimizedStats = await fs.stat(outputPath)
      totalOptimized += optimizedStats.size

      const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1)
      console.log(`✓ ${file} → ${(optimizedStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`)
      processed++
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`)
    }
  }

  console.log(`\n==========================================`)
  console.log(`Optimization complete!`)
  console.log(`==========================================`)
  console.log(`Processed: ${processed}/${imageFiles.length} images`)
  console.log(`Original:  ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Optimized: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Saved:     ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`)
  console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`)
}

optimizeImages().catch(console.error)
