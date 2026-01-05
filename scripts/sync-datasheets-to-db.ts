/**
 * Sync datasheets to product_downloads table
 * Links found datasheets to their corresponding products in the database
 */

import { db } from "../src/db"
import { products, productDownloads } from "../src/db/schema"
import { eq, or, like, ilike, sql } from "drizzle-orm"
import * as fs from "fs"

const INVENTORY_PATH = ".planning/audit/datasheet-inventory.json"
const BASE_URL = "https://www.dewaterproducts.com.au/assets/brochures"

interface DatasheetStatus {
  sku: string
  name: string
  pdfUrl: string
  status: "found" | "not_found" | "error"
}

interface Inventory {
  scannedAt: string
  totalSkus: number
  found: number
  notFound: number
  results: DatasheetStatus[]
}

async function main() {
  const dryRun = process.argv.includes("--dry-run")

  console.log(dryRun ? "🔍 DRY RUN - No changes will be made\n" : "🔄 Syncing datasheets to database...\n")

  // Read inventory
  const inventory: Inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, "utf-8"))
  const foundDatasheets = inventory.results.filter(r => r.status === "found")

  console.log(`Found ${foundDatasheets.length} datasheets to process\n`)

  // Get all products from database
  const allProducts = await db.select({
    id: products.id,
    sku: products.sku,
    name: products.name,
    slug: products.slug
  }).from(products)

  console.log(`Database has ${allProducts.length} products\n`)

  // Get existing downloads
  const existingDownloads = await db.select().from(productDownloads)
  const existingUrls = new Set(existingDownloads.map(d => d.url))

  let matched = 0
  let alreadyExists = 0
  let notMatched = 0
  const toInsert: { productId: number; url: string; label: string; sku: string; productName: string }[] = []
  const unmatched: { sku: string; name: string }[] = []

  for (const datasheet of foundDatasheets) {
    // Find matching product by SKU
    // Try exact match first, then partial match
    let product = allProducts.find(p =>
      p.sku === datasheet.sku ||
      p.sku?.toLowerCase() === datasheet.sku.toLowerCase()
    )

    // Try partial match (SKU contains or is contained in datasheet SKU)
    if (!product) {
      product = allProducts.find(p =>
        p.sku && (
          p.sku.toLowerCase().includes(datasheet.sku.toLowerCase()) ||
          datasheet.sku.toLowerCase().includes(p.sku.toLowerCase())
        )
      )
    }

    // Try matching by slug
    if (!product) {
      const slugVariants = [
        datasheet.sku.toLowerCase().replace(/_/g, "-"),
        datasheet.sku.toLowerCase().replace(/-/g, "_"),
        datasheet.sku.toLowerCase()
      ]
      product = allProducts.find(p =>
        slugVariants.some(v => p.slug?.includes(v))
      )
    }

    if (product) {
      // Check if download already exists
      if (existingUrls.has(datasheet.pdfUrl)) {
        alreadyExists++
        console.log(`⏭️  ${datasheet.sku} → ${product.sku} (already exists)`)
      } else {
        matched++
        console.log(`✅ ${datasheet.sku} → ${product.sku} (${product.name})`)
        toInsert.push({
          productId: product.id,
          url: datasheet.pdfUrl,
          label: "Product Datasheet",
          sku: product.sku!,
          productName: product.name
        })
      }
    } else {
      notMatched++
      console.log(`❓ ${datasheet.sku} → No matching product found`)
      unmatched.push({ sku: datasheet.sku, name: datasheet.name })
    }
  }

  console.log("\n" + "=".repeat(50))
  console.log("📊 Summary")
  console.log("=".repeat(50))
  console.log(`Total datasheets found: ${foundDatasheets.length}`)
  console.log(`✅ Matched to products: ${matched}`)
  console.log(`⏭️  Already in database: ${alreadyExists}`)
  console.log(`❓ No product match: ${notMatched}`)

  if (unmatched.length > 0) {
    console.log("\n📋 Unmatched datasheets (products may not be in DB):")
    for (const u of unmatched) {
      console.log(`  - ${u.sku}: ${u.name}`)
    }
  }

  if (!dryRun && toInsert.length > 0) {
    console.log(`\n🔄 Inserting ${toInsert.length} new downloads...`)

    for (const item of toInsert) {
      await db.insert(productDownloads).values({
        productId: item.productId,
        url: item.url,
        label: item.label,
        fileType: "pdf"
      })
    }

    console.log("✅ Done!")
  } else if (dryRun && toInsert.length > 0) {
    console.log(`\n📝 Would insert ${toInsert.length} downloads:`)
    for (const item of toInsert) {
      console.log(`  - ${item.sku}: ${item.url}`)
    }
    console.log("\nRun without --dry-run to apply changes")
  } else {
    console.log("\n✅ No new downloads to insert")
  }
}

main().catch(console.error)
