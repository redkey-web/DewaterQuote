/**
 * Analyze content gaps between Neto CSV and database
 *
 * This script compares products in Neto export with database products to find:
 * 1. Products in Neto but missing from DB
 * 2. Products with richer content in Neto (description, bullet points, SEO)
 *
 * Run: DATABASE_URL="..." npx tsx scripts/analyze-content-gaps.ts
 */

import { config } from "dotenv"
config({ path: ".env.local" })

import * as fs from "fs"
import { parse } from "csv-parse/sync"
import { neon } from "@neondatabase/serverless"

const CSV_PATH = ".planning/audit/neto-export.csv"
const OUTPUT_PATH = ".planning/audit/content-gap-analysis.json"

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

interface NetoProduct {
  sku: string
  parentSku: string
  name: string
  active: boolean
  description: string
  shortDescription: string
  bulletPoints: string[]
  seoMetaKeywords: string
  seoMetaDescription: string
  seoPageTitle: string
}

interface DbProduct {
  id: number
  sku: string
  name: string
  description: string
  isActive: boolean
}

interface DbFeature {
  productId: number
  feature: string
}

interface DbSeo {
  productId: number
  metaKeywords: string | null
  metaDescription: string | null
  pageTitle: string | null
}

interface ContentGap {
  sku: string
  name: string
  field: string
  netoValue: string
  dbValue: string
  recommendation: "sync" | "review" | "skip"
}

interface MissingProduct {
  sku: string
  name: string
  active: boolean
  hasContent: boolean
  bulletPointCount: number
}

// Parse bullet points from HTML
function parseBulletPoints(html: string): string[] {
  if (!html) return []
  // Match <li>...</li> content
  const matches = html.match(/<li[^>]*>(.*?)<\/li>/gi) || []
  return matches.map((li) =>
    li
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim()
  )
}

// Parse Neto CSV into parent products only
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

    // Only process parent products (no parentSku means it's a parent)
    if (parentSku) continue
    if (!sku) continue

    const active = row["Active"]?.toLowerCase() === "y"
    const bulletPoints = parseBulletPoints(row["Bullet points"] || "")

    products.set(sku, {
      sku,
      parentSku: "",
      name: row["Name"]?.trim() || "",
      active,
      description: row["Description"]?.trim() || "",
      shortDescription: row["Short Description"]?.trim() || "",
      bulletPoints,
      seoMetaKeywords: row["SEO Meta Keywords"]?.trim() || "",
      seoMetaDescription: row["SEO Meta Description"]?.trim() || "",
      seoPageTitle: row["SEO Page Title"]?.trim() || "",
    })
  }

  console.log(`   Found ${products.size} parent products in Neto`)
  return products
}

async function getDbProducts(): Promise<Map<string, DbProduct>> {
  console.log("🗄️  Querying database products...")

  const results = (await sql`
    SELECT id, sku, name, description, is_active
    FROM products
  `) as Array<{
    id: number
    sku: string
    name: string
    description: string
    is_active: boolean
  }>

  const map = new Map<string, DbProduct>()
  for (const r of results) {
    map.set(r.sku, {
      id: r.id,
      sku: r.sku,
      name: r.name,
      description: r.description,
      isActive: r.is_active,
    })
  }

  console.log(`   Found ${map.size} products in database`)
  return map
}

async function getDbFeatures(): Promise<Map<number, DbFeature[]>> {
  const results = (await sql`
    SELECT product_id, feature FROM product_features ORDER BY product_id, display_order
  `) as Array<{ product_id: number; feature: string }>

  const map = new Map<number, DbFeature[]>()
  for (const r of results) {
    if (!map.has(r.product_id)) {
      map.set(r.product_id, [])
    }
    map.get(r.product_id)!.push({ productId: r.product_id, feature: r.feature })
  }

  return map
}

async function getDbSeo(): Promise<Map<number, DbSeo>> {
  const results = (await sql`
    SELECT product_id, meta_keywords, meta_description, page_title FROM product_seo
  `) as Array<{
    product_id: number
    meta_keywords: string | null
    meta_description: string | null
    page_title: string | null
  }>

  const map = new Map<number, DbSeo>()
  for (const r of results) {
    map.set(r.product_id, {
      productId: r.product_id,
      metaKeywords: r.meta_keywords,
      metaDescription: r.meta_description,
      pageTitle: r.page_title,
    })
  }

  return map
}

// Check if Neto content is "richer" than DB content
function isRicher(netoValue: string, dbValue: string): boolean {
  if (!netoValue) return false
  if (!dbValue) return true
  // Neto content is richer if it's significantly longer
  return netoValue.length > dbValue.length * 1.5
}

async function main() {
  console.log("=".repeat(60))
  console.log("CONTENT GAP ANALYSIS: Neto CSV vs Database")
  console.log("=".repeat(60))

  const netoProducts = parseNetoCsv()
  const dbProducts = await getDbProducts()
  const dbFeatures = await getDbFeatures()
  const dbSeo = await getDbSeo()

  // Analysis results
  const missingProducts: MissingProduct[] = []
  const contentGaps: ContentGap[] = []
  const matchedProducts: string[] = []

  // Stats
  let netoActive = 0
  let netoWithDescription = 0
  let netoWithBullets = 0
  let netoWithSeo = 0

  for (const [sku, neto] of netoProducts) {
    if (neto.active) netoActive++
    if (neto.description) netoWithDescription++
    if (neto.bulletPoints.length > 0) netoWithBullets++
    if (neto.seoMetaDescription || neto.seoMetaKeywords) netoWithSeo++

    // Find matching DB product
    const dbProduct = dbProducts.get(sku)

    if (!dbProduct) {
      // Product in Neto but not in DB
      missingProducts.push({
        sku,
        name: neto.name,
        active: neto.active,
        hasContent: !!(neto.description || neto.bulletPoints.length > 0),
        bulletPointCount: neto.bulletPoints.length,
      })
      continue
    }

    matchedProducts.push(sku)

    // Compare content
    const productFeatures = dbFeatures.get(dbProduct.id) || []
    const productSeo = dbSeo.get(dbProduct.id)

    // Check description
    if (isRicher(neto.description, dbProduct.description)) {
      contentGaps.push({
        sku,
        name: neto.name,
        field: "description",
        netoValue: neto.description.substring(0, 200) + (neto.description.length > 200 ? "..." : ""),
        dbValue: dbProduct.description.substring(0, 200) + (dbProduct.description.length > 200 ? "..." : ""),
        recommendation: "review",
      })
    }

    // Check bullet points / features
    const dbBulletCount = productFeatures.length
    if (neto.bulletPoints.length > dbBulletCount) {
      contentGaps.push({
        sku,
        name: neto.name,
        field: "bulletPoints",
        netoValue: `${neto.bulletPoints.length} bullets: ${neto.bulletPoints.slice(0, 3).join("; ")}`,
        dbValue: `${dbBulletCount} features`,
        recommendation: dbBulletCount === 0 ? "sync" : "review",
      })
    }

    // Check SEO meta description
    if (neto.seoMetaDescription && !productSeo?.metaDescription) {
      contentGaps.push({
        sku,
        name: neto.name,
        field: "seoMetaDescription",
        netoValue: neto.seoMetaDescription.substring(0, 160),
        dbValue: "(empty)",
        recommendation: "sync",
      })
    }

    // Check SEO keywords
    if (neto.seoMetaKeywords && !productSeo?.metaKeywords) {
      contentGaps.push({
        sku,
        name: neto.name,
        field: "seoMetaKeywords",
        netoValue: neto.seoMetaKeywords,
        dbValue: "(empty)",
        recommendation: "sync",
      })
    }
  }

  // Sort missing products
  const missingActive = missingProducts.filter((p) => p.active)
  const missingInactive = missingProducts.filter((p) => !p.active)

  // Output summary
  console.log("\n" + "=".repeat(60))
  console.log("📊 SUMMARY")
  console.log("=".repeat(60))

  console.log("\n### Neto Export Stats")
  console.log(`Total parent products: ${netoProducts.size}`)
  console.log(`Active products: ${netoActive}`)
  console.log(`With description: ${netoWithDescription} (${((netoWithDescription / netoProducts.size) * 100).toFixed(1)}%)`)
  console.log(`With bullet points: ${netoWithBullets} (${((netoWithBullets / netoProducts.size) * 100).toFixed(1)}%)`)
  console.log(`With SEO data: ${netoWithSeo} (${((netoWithSeo / netoProducts.size) * 100).toFixed(1)}%)`)

  console.log("\n### Database Stats")
  console.log(`Total products: ${dbProducts.size}`)
  console.log(`Matched to Neto: ${matchedProducts.length}`)

  console.log("\n### Missing from Database")
  console.log(`Active products NOT in DB: ${missingActive.length}`)
  console.log(`Inactive products NOT in DB: ${missingInactive.length}`)

  if (missingActive.length > 0) {
    console.log("\n⚠️  Active products missing from DB:")
    for (const p of missingActive.slice(0, 20)) {
      console.log(`   - ${p.sku}: ${p.name} (${p.bulletPointCount} bullets)`)
    }
    if (missingActive.length > 20) {
      console.log(`   ... and ${missingActive.length - 20} more`)
    }
  }

  console.log("\n### Content Gaps (Neto has richer content)")
  const gapsByField = new Map<string, ContentGap[]>()
  for (const gap of contentGaps) {
    if (!gapsByField.has(gap.field)) {
      gapsByField.set(gap.field, [])
    }
    gapsByField.get(gap.field)!.push(gap)
  }

  for (const [field, gaps] of gapsByField) {
    const toSync = gaps.filter((g) => g.recommendation === "sync").length
    const toReview = gaps.filter((g) => g.recommendation === "review").length
    console.log(`\n${field}: ${gaps.length} gaps (${toSync} to sync, ${toReview} to review)`)
    for (const g of gaps.slice(0, 5)) {
      console.log(`   - ${g.sku}: Neto: "${g.netoValue.substring(0, 60)}..."`)
    }
    if (gaps.length > 5) {
      console.log(`   ... and ${gaps.length - 5} more`)
    }
  }

  // Save detailed results
  const output = {
    analyzedAt: new Date().toISOString(),
    stats: {
      netoTotal: netoProducts.size,
      netoActive,
      netoWithDescription,
      netoWithBullets,
      netoWithSeo,
      dbTotal: dbProducts.size,
      matched: matchedProducts.length,
      missingActive: missingActive.length,
      missingInactive: missingInactive.length,
      contentGapsTotal: contentGaps.length,
    },
    missingProducts: {
      active: missingActive,
      inactive: missingInactive,
    },
    contentGaps: {
      bulletPoints: contentGaps.filter((g) => g.field === "bulletPoints"),
      description: contentGaps.filter((g) => g.field === "description"),
      seoMetaDescription: contentGaps.filter((g) => g.field === "seoMetaDescription"),
      seoMetaKeywords: contentGaps.filter((g) => g.field === "seoMetaKeywords"),
    },
    recommendations: {
      syncBulletPoints: contentGaps.filter((g) => g.field === "bulletPoints" && g.recommendation === "sync"),
      syncSeo: contentGaps.filter((g) => g.field.startsWith("seo") && g.recommendation === "sync"),
    },
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))
  console.log(`\n✅ Detailed analysis saved to: ${OUTPUT_PATH}`)
}

main().catch(console.error)
