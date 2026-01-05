/**
 * Sync Neto content to database
 *
 * Syncs bullet points from Neto CSV to product_features table
 *
 * Run: npx tsx scripts/sync-neto-content.ts --dry-run
 * Apply: npx tsx scripts/sync-neto-content.ts --fix
 */

import { config } from "dotenv"
config({ path: ".env.local" })

import * as fs from "fs"
import { parse } from "csv-parse/sync"
import { neon } from "@neondatabase/serverless"

const CSV_PATH = ".planning/audit/neto-export.csv"

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

const args = process.argv.slice(2)
const isDryRun = args.includes("--dry-run")
const shouldFix = args.includes("--fix")
const filterSku = args.find((a) => a.startsWith("--sku="))?.split("=")[1]

if (!isDryRun && !shouldFix) {
  console.log("Usage:")
  console.log("  --dry-run  Preview changes without applying")
  console.log("  --fix      Apply changes to database")
  console.log("  --sku=X    Only process specific SKU")
  process.exit(0)
}

// Parse bullet points from HTML
function parseBulletPoints(html: string): string[] {
  if (!html) return []
  const matches = html.match(/<li[^>]*>(.*?)<\/li>/gi) || []
  return matches
    .map((li) =>
      li
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
    )
    .filter((text) => text.length > 0)
}

interface NetoProduct {
  sku: string
  name: string
  bulletPoints: string[]
}

interface DbProduct {
  id: number
  sku: string
  name: string
}

interface FeatureSync {
  productId: number
  sku: string
  name: string
  features: string[]
  existingCount: number
}

// Parse Neto CSV - parent products only
function parseNetoCsv(): Map<string, NetoProduct> {
  console.log("📦 Parsing Neto CSV...")

  const csvContent = fs.readFileSync(CSV_PATH, "utf-8")
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  })

  const products = new Map<string, NetoProduct>()

  for (const row of records) {
    const sku = row["SKU*"]?.trim()
    const parentSku = row["Parent SKU"]?.trim()

    // Only parent products (no parentSku)
    if (parentSku) continue
    if (!sku) continue

    // Only active products
    const active = row["Active"]?.toLowerCase() === "y"
    if (!active) continue

    const bulletPoints = parseBulletPoints(row["Bullet points"] || "")
    if (bulletPoints.length === 0) continue

    if (filterSku && sku !== filterSku) continue

    products.set(sku, {
      sku,
      name: row["Name"]?.trim() || "",
      bulletPoints,
    })
  }

  console.log(`   Found ${products.size} products with bullet points`)
  return products
}

async function getDbProducts(): Promise<Map<string, DbProduct>> {
  console.log("🗄️  Querying database...")

  const results = (await sql`
    SELECT id, sku, name FROM products WHERE is_active = true
  `) as Array<{ id: number; sku: string; name: string }>

  const map = new Map<string, DbProduct>()
  for (const r of results) {
    map.set(r.sku, { id: r.id, sku: r.sku, name: r.name })
  }

  console.log(`   Found ${map.size} active products`)
  return map
}

async function getExistingFeatures(): Promise<Map<number, number>> {
  const results = (await sql`
    SELECT product_id, COUNT(*) as count
    FROM product_features
    GROUP BY product_id
  `) as Array<{ product_id: number; count: string }>

  const map = new Map<number, number>()
  for (const r of results) {
    map.set(r.product_id, parseInt(r.count))
  }
  return map
}

async function main() {
  console.log("=".repeat(60))
  console.log("SYNC NETO CONTENT TO DATABASE")
  console.log("=".repeat(60))
  console.log(`Mode: ${shouldFix ? "FIX" : "DRY RUN"}`)
  if (filterSku) console.log(`Filter: ${filterSku}`)

  const netoProducts = parseNetoCsv()
  const dbProducts = await getDbProducts()
  const existingFeatures = await getExistingFeatures()

  const toSync: FeatureSync[] = []
  let skipped = 0

  for (const [sku, neto] of netoProducts) {
    const dbProduct = dbProducts.get(sku)
    if (!dbProduct) {
      continue // Product not in DB
    }

    const existingCount = existingFeatures.get(dbProduct.id) || 0

    // Only sync if DB has no features for this product
    if (existingCount > 0) {
      skipped++
      continue
    }

    toSync.push({
      productId: dbProduct.id,
      sku,
      name: dbProduct.name,
      features: neto.bulletPoints,
      existingCount,
    })
  }

  console.log("\n" + "=".repeat(60))
  console.log("📊 SUMMARY")
  console.log("=".repeat(60))
  console.log(`Products with bullet points in Neto: ${netoProducts.size}`)
  console.log(`Already have features in DB: ${skipped}`)
  console.log(`Need features synced: ${toSync.length}`)

  if (toSync.length === 0) {
    console.log("\n✅ No features to sync!")
    return
  }

  console.log("\n📋 Products to sync:")
  for (const item of toSync.slice(0, 20)) {
    console.log(`   ${item.sku}: ${item.features.length} features`)
    for (const f of item.features.slice(0, 3)) {
      console.log(`      - ${f.substring(0, 60)}${f.length > 60 ? "..." : ""}`)
    }
  }
  if (toSync.length > 20) {
    console.log(`   ... and ${toSync.length - 20} more products`)
  }

  const totalFeatures = toSync.reduce((sum, item) => sum + item.features.length, 0)
  console.log(`\nTotal features to insert: ${totalFeatures}`)

  if (shouldFix) {
    console.log("\n⚡ Applying changes...")

    let inserted = 0
    for (const item of toSync) {
      for (let i = 0; i < item.features.length; i++) {
        await sql`
          INSERT INTO product_features (product_id, feature, display_order)
          VALUES (${item.productId}, ${item.features[i]}, ${i + 1})
        `
        inserted++
      }
    }

    console.log(`✅ Inserted ${inserted} features for ${toSync.length} products`)
  } else {
    console.log("\n💡 Run with --fix to apply changes")
  }
}

main().catch(console.error)
