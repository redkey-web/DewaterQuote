#!/usr/bin/env node
/**
 * Scrape Straub product catalog from straub.ch
 * Downloads images and generates catalog data
 */

import fs from 'fs/promises'
import path from 'path'
import https from 'https'

const BASE_URL = 'https://www.straub.ch'
const OUTPUT_DIR = './public/images/products/straub'

// All Straub products with their URLs
const STRAUB_PRODUCTS = [
  // Axial Restraint
  { id: 'STRAUB-METAL-GRIP', slug: 'straub-metal-grip', url: '/en/straub-pipe-couplings/axial-restraint-pipe-coupling/straub-metal-grip', sizeRange: '30.0 to 609.6 mm', pressure: '67 bar', category: 'axial-restraint' },
  { id: 'STRAUB-METAL-GRIP-FF', slug: 'straub-metal-grip-ff', url: '/en/straub-pipe-couplings/axial-restraint-pipe-coupling/straub-metal-grip-ff', sizeRange: '30.0 to 457.2 mm', pressure: '67 bar', category: 'axial-restraint' },
  { id: 'STRAUB-GRIP', slug: 'straub-grip', url: '/en/straub-pipe-couplings/axial-restraint-pipe-coupling/straub-grip', sizeRange: '25 to 711.2 mm', pressure: '40 bar', category: 'axial-restraint' },
  { id: 'STRAUB-GRIP-FF', slug: 'straub-grip-ff', url: '/en/straub-pipe-couplings/axial-restraint-pipe-coupling/straub-grip-ff', sizeRange: '25.0 to 406.4 mm', pressure: '40 bar', category: 'axial-restraint' },
  { id: 'STRAUB-PLAST-GRIP', slug: 'straub-plast-grip', url: '/en/straub-pipe-couplings/axial-restraint-pipe-coupling/straub-plast-grip', sizeRange: '40.0 to 355.0 mm', pressure: '16 bar', category: 'axial-restraint' },
  { id: 'STRAUB-COMBI-GRIP', slug: 'straub-combi-grip', url: '/en/straub-pipe-couplings/axial-restraint-pipe-coupling/straub-combi-grip', sizeRange: '40.0/38.0 to 355.0/355.6 mm', pressure: '16 bar', category: 'axial-restraint' },
  { id: 'STRAUB-PLAST-PRO', slug: 'straub-plast-pro', url: '/en/straub-pipe-couplings/axial-restraint-pipe-coupling/straub-plast-pro', sizeRange: '63.0-180.0 / 125.0-355.0 mm', pressure: '16 bar', category: 'axial-restraint' },

  // Non-Axial Restraint (Flex)
  { id: 'STRAUB-FLEX-1', slug: 'straub-flex-1', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-flex-1l', sizeRange: '48.3 to 168.3 mm', pressure: '25 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-FLEX-2', slug: 'straub-flex-2', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-flex-2', sizeRange: '172.0 to 2032.0 mm', pressure: '16 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-FLEX-3', slug: 'straub-flex-3', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-flex-3', sizeRange: '219.1 to 2032.0 mm', pressure: '10 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-FLEX-35', slug: 'straub-flex-35', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-flex-35', sizeRange: '323.9 to 1219.2 mm', pressure: '10 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-FLEX-4', slug: 'straub-flex-4', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-flex-4', sizeRange: '323.9 to 812.8 mm', pressure: '10 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-OPEN-FLEX-1', slug: 'straub-open-flex-1', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-open-flex-1l', sizeRange: '48.3 to 168.3 mm', pressure: '25 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-OPEN-FLEX-2', slug: 'straub-open-flex-2', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-open-flex-2', sizeRange: '172.0 to 2032.0 mm', pressure: '16 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-OPEN-FLEX-3', slug: 'straub-open-flex-3', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-open-flex-3', sizeRange: '219.1 to 4064.0 mm', pressure: '10 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-OPEN-FLEX-35', slug: 'straub-open-flex-35', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-open-flex-35', sizeRange: '323.9 to 4064.0 mm', pressure: '10 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-OPEN-FLEX-4', slug: 'straub-open-flex-4', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-open-flex-4', sizeRange: '323.9 to 4064.0 mm', pressure: '10 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-STEP-FLEX-2', slug: 'straub-step-flex-2', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-step-flex-2', sizeRange: '219.1 to 812.8 mm', pressure: '10 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-STEP-FLEX-3', slug: 'straub-step-flex-3', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-step-flex-3', sizeRange: '914.4 to 2032.0 mm', pressure: '10 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-SQUARE-FLEX', slug: 'straub-square-flex', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-square-flex', sizeRange: '60, 80, 100 mm', pressure: '6 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-REP-FLEX', slug: 'straub-rep-flex', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-rep-flex', sizeRange: '46.0 to 429.0 mm', pressure: '16 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-CLAMP-1PC', slug: 'straub-clamp-one-piece', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-clamp-one-piece', sizeRange: '44.0 to 330.0 mm', pressure: '10 bar', category: 'non-axial-restraint' },
  { id: 'STRAUB-CLAMP-2PC', slug: 'straub-clamp-two-piece', url: '/en/straub-pipe-couplings/non-axial-restraint-pipe-coupling/straub-clamp-two-piece', sizeRange: '88.0 to 440.0 mm', pressure: '10 bar', category: 'non-axial-restraint' },

  // Shaped Parts
  { id: 'STRAUB-ELBOW-90', slug: 'straub-elbow-90', url: '/en/straub-pipe-couplings/shaped-parts/elbow-90', sizeRange: 'Various', pressure: '25 bar', category: 'shaped-parts' },
  { id: 'STRAUB-ELBOW-45', slug: 'straub-elbow-45', url: '/en/straub-pipe-couplings/shaped-parts/elbow-45', sizeRange: 'Various', pressure: '25 bar', category: 'shaped-parts' },
  { id: 'STRAUB-EQUAL-TEE', slug: 'straub-equal-tee', url: '/en/straub-pipe-couplings/shaped-parts/equal-tee', sizeRange: 'Various', pressure: '25 bar', category: 'shaped-parts' },
  { id: 'STRAUB-REDUCING-TEE', slug: 'straub-reducing-tee', url: '/en/straub-pipe-couplings/shaped-parts/reducing-tee', sizeRange: 'Various', pressure: '25 bar', category: 'shaped-parts' },
  { id: 'STRAUB-REDUCER', slug: 'straub-reducer-concentric', url: '/en/straub-pipe-couplings/shaped-parts/reducers-concentric', sizeRange: 'Various', pressure: '25 bar', category: 'shaped-parts' },
  { id: 'STRAUB-FLANGE-ADAPTER', slug: 'straub-flange-adapter', url: '/en/straub-pipe-couplings/shaped-parts/flange-adapter', sizeRange: 'Various', pressure: '25 bar', category: 'shaped-parts' },
  { id: 'STRAUB-END-CAP', slug: 'straub-pipe-end-cap', url: '/en/straub-pipe-couplings/shaped-parts/pipe-end-caps', sizeRange: 'Various', pressure: '25 bar', category: 'shaped-parts' },
  { id: 'STRAUB-THREADED', slug: 'straub-threaded-connection', url: '/en/straub-pipe-couplings/shaped-parts/threaded-connection', sizeRange: 'Various', pressure: '25 bar', category: 'shaped-parts' },
]

// Known image paths from Straub website (from inspection)
const IMAGE_MAPPINGS = {
  'STRAUB-METAL-GRIP': ['metal-grip'],
  'STRAUB-METAL-GRIP-FF': ['metal-grip-ff'],
  'STRAUB-GRIP': ['grip'],
  'STRAUB-GRIP-FF': ['grip-ff'],
  'STRAUB-PLAST-GRIP': ['plast-grip'],
  'STRAUB-COMBI-GRIP': ['combi-grip'],
  'STRAUB-PLAST-PRO': ['plast-pro'],
  'STRAUB-FLEX-1': ['flex-1l'],
  'STRAUB-FLEX-2': ['flex-2'],
  'STRAUB-FLEX-3': ['flex-3'],
  'STRAUB-FLEX-35': ['flex-35'],
  'STRAUB-FLEX-4': ['flex-4'],
  'STRAUB-OPEN-FLEX-1': ['open-flex-1l'],
  'STRAUB-OPEN-FLEX-2': ['open-flex-2'],
  'STRAUB-OPEN-FLEX-3': ['open-flex-3'],
  'STRAUB-OPEN-FLEX-35': ['open-flex-35'],
  'STRAUB-OPEN-FLEX-4': ['open-flex-4'],
  'STRAUB-STEP-FLEX-2': ['step-flex-2'],
  'STRAUB-STEP-FLEX-3': ['step-flex-3'],
  'STRAUB-SQUARE-FLEX': ['square-flex'],
  'STRAUB-REP-FLEX': ['rep-flex'],
  'STRAUB-CLAMP-1PC': ['clamp'],
  'STRAUB-CLAMP-2PC': ['clamp'],
  'STRAUB-ELBOW-90': ['STRAUB-Formteil_B90'],
  'STRAUB-ELBOW-45': ['STRAUB-Formteil_B45'],
  'STRAUB-EQUAL-TEE': ['STRAUB-Formteil_T'],
  'STRAUB-REDUCING-TEE': ['STRAUB-Formteil_TR'],
  'STRAUB-REDUCER': ['STRAUB-Formteil_R'],
  'STRAUB-FLANGE-ADAPTER': ['STRAUB-Formteil_FA'],
  'STRAUB-END-CAP': ['STRAUB-Formteil_EC'],
  'STRAUB-THREADED': ['STRAUB-Formteil_AG'],
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = require('fs').createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        https.get(response.headers.location, (res) => {
          res.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve(true)
          })
        }).on('error', reject)
      } else if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve(true)
        })
      } else {
        reject(new Error(`HTTP ${response.statusCode}`))
      }
    }).on('error', reject)
  })
}

async function fetchPage(url) {
  const response = await fetch(BASE_URL + url)
  return await response.text()
}

function extractImageUrls(html) {
  const imageUrls = []
  // Match PNG and JPG images from fileadmin
  const regex = /\/fileadmin\/Straub\/[^"'\s)]+\.(png|jpg|jpeg)/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    if (!imageUrls.includes(match[0])) {
      imageUrls.push(match[0])
    }
  }
  return imageUrls
}

async function main() {
  console.log('Scraping Straub products...\n')

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const results = []

  for (const product of STRAUB_PRODUCTS) {
    console.log(`Processing ${product.id}...`)

    try {
      // Fetch product page
      const html = await fetchPage(product.url)

      // Extract image URLs
      const imageUrls = extractImageUrls(html)
      console.log(`  Found ${imageUrls.length} images`)

      // Filter to product images (exclude icons, logos, etc.)
      const productImages = imageUrls.filter(url =>
        url.includes('csm_') &&
        !url.includes('icon') &&
        !url.includes('logo') &&
        !url.includes('flag')
      ).slice(0, 4) // Max 4 images per product

      // Download images
      const downloadedImages = []
      for (let i = 0; i < productImages.length; i++) {
        const imgUrl = productImages[i]
        const ext = imgUrl.split('.').pop()
        const filename = i === 0
          ? `${product.slug}.${ext}`
          : `${product.slug}_alt${i}.${ext}`
        const filepath = path.join(OUTPUT_DIR, filename)

        try {
          await downloadImage(BASE_URL + imgUrl, filepath)
          downloadedImages.push(`/images/products/straub/${filename}`)
          console.log(`  Downloaded: ${filename}`)
        } catch (err) {
          console.log(`  Failed to download: ${imgUrl}`)
        }
      }

      results.push({
        ...product,
        images: downloadedImages
      })

      // Small delay to be respectful
      await new Promise(r => setTimeout(r, 500))

    } catch (err) {
      console.log(`  Error: ${err.message}`)
      results.push({
        ...product,
        images: []
      })
    }
  }

  // Save results
  const outputPath = './scripts/straub-products.json'
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2))
  console.log(`\nSaved ${results.length} products to ${outputPath}`)

  // Generate TypeScript catalog entries
  generateCatalogCode(results)
}

function generateCatalogCode(products) {
  let code = `\n// ========== STRAUB PRODUCTS ==========\n\n`

  for (const p of products) {
    const name = p.id.replace(/-/g, ' ').replace(/(\d+)PC/g, '$1-Piece')
    const shortName = name
    const images = p.images.length > 0
      ? p.images.map((url, i) => `{ url: "${url}", alt: "${name}${i > 0 ? ` - View ${i+1}` : ''}", type: "image" as const }`)
      : [`{ url: "/images/products/straub/${p.slug}.png", alt: "${name}", type: "image" as const }`]

    code += `  {
    id: "${p.id}",
    slug: "${p.slug}",
    sku: "${p.id}",
    name: "${name}",
    shortName: "${shortName}",
    brand: "Straub",
    category: "pipe-couplings",
    subcategory: "straub-couplings",
    description: "Swiss-engineered ${name.toLowerCase()} pipe coupling. Premium quality with ${p.pressure} pressure rating. Size range: ${p.sizeRange}.",
    features: [
      "Swiss precision engineering",
      "Pressure rating: ${p.pressure}",
      "Size range: ${p.sizeRange}",
      "EPDM and NBR sealing sleeves available",
      "Temperature range: -30°C to +100°C (EPDM)",
      "DIN 86128 compliant",
      "5-year warranty"
    ],
    specifications: [
      { label: "SKU", value: "${p.id}" },
      { label: "Brand", value: "Straub" },
      { label: "Pressure Rating", value: "${p.pressure}" },
      { label: "Size Range", value: "${p.sizeRange}" },
      { label: "Temperature Range", value: "-30°C to +100°C" },
      { label: "Sealing Material", value: "EPDM/NBR" }
    ],
    images: [
      ${images.join(',\n      ')}
    ],
    materials: {
      body: "Stainless Steel",
      sleeve: "EPDM"
    },
    pressureRange: "0 TO ${parseInt(p.pressure)} BAR",
    sizeFrom: "${p.sizeRange.split(' ')[0]}",
    leadTime: "2-3 weeks",
    applications: ["Industrial piping", "Marine", "Chemical plants", "Water treatment"],
    certifications: "DIN 86128-1 and 86128-2 compliant. Swiss quality manufacturing with 5-year warranty."
  },\n\n`
  }

  const codePath = './scripts/straub-catalog-entries.ts'
  require('fs').writeFileSync(codePath, code)
  console.log(`Generated catalog code: ${codePath}`)
}

main().catch(console.error)
