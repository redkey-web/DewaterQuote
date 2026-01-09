/**
 * Generate a depth map from the industrial illustration
 * Uses grayscale conversion with contrast enhancement
 */
import sharp from 'sharp'
import path from 'path'

const INPUT_PATH = path.join(process.cwd(), 'public/images/hero-illustration-industrial.png')
const OUTPUT_PATH = path.join(process.cwd(), 'public/images/hero-depthmap.png')

async function generateDepthMap() {
  console.log('Generating depth map from:', INPUT_PATH)

  // Get input image dimensions
  const metadata = await sharp(INPUT_PATH).metadata()
  console.log(`Input dimensions: ${metadata.width}x${metadata.height}`)

  await sharp(INPUT_PATH)
    // Convert to grayscale
    .grayscale()
    // Enhance contrast for better depth separation
    .normalize()
    // Apply slight blur for smoother displacement
    .blur(2)
    // Adjust contrast curve for better depth effect
    // Darker areas = closer (more displacement)
    // Lighter areas = farther (less displacement)
    .linear(1.2, -20) // Increase contrast slightly
    // Output as PNG for lossless quality
    .png()
    .toFile(OUTPUT_PATH)

  console.log('Depth map saved to:', OUTPUT_PATH)

  // Also create a WebP version for production
  const webpPath = OUTPUT_PATH.replace('.png', '.webp')
  await sharp(OUTPUT_PATH)
    .webp({ quality: 90 })
    .toFile(webpPath)
  console.log('WebP version saved to:', webpPath)
}

generateDepthMap()
  .then(() => console.log('Done!'))
  .catch(console.error)
