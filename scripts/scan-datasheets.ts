/**
 * Scan for datasheets on production site
 * Checks which products have PDFs available at /assets/brochures/
 */

import * as fs from "fs"
import * as path from "path"
import { parse } from "csv-parse/sync"

const NETO_CSV_PATH = ".planning/audit/neto-export.csv"
const BASE_URL = "https://www.dewaterproducts.com.au/assets/brochures"
const OUTPUT_PATH = ".planning/audit/datasheet-inventory.json"

interface DatasheetStatus {
  sku: string
  name: string
  pdfUrl: string
  status: "found" | "not_found" | "error"
  statusCode?: number
  contentType?: string
}

async function checkPdfExists(url: string): Promise<{ exists: boolean; statusCode: number; contentType?: string }> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    const contentType = response.headers.get("content-type") || ""
    return {
      exists: response.ok && contentType.includes("pdf"),
      statusCode: response.status,
      contentType: contentType
    }
  } catch (error) {
    return { exists: false, statusCode: 0 }
  }
}

async function main() {
  console.log("🔍 Scanning for datasheets on production site...\n")

  // Read Neto CSV
  const csvContent = fs.readFileSync(NETO_CSV_PATH, "utf-8")
  const records = parse(csvContent, { columns: true, skip_empty_lines: true })

  // Extract unique parent SKUs
  const parentSkus = new Map<string, string>() // SKU -> Name
  for (const row of records) {
    const parentSku = row["Parent SKU"]?.trim()
    const sku = row["SKU*"]?.trim()
    const name = row["Name"]?.trim()

    if (!parentSku && sku) {
      // This is a parent product
      parentSkus.set(sku, name)
    } else if (parentSku && !parentSkus.has(parentSku)) {
      // First variation of a parent
      parentSkus.set(parentSku, name)
    }
  }

  console.log(`Found ${parentSkus.size} unique parent SKUs to check\n`)

  const results: DatasheetStatus[] = []
  let foundCount = 0
  let notFoundCount = 0

  // Check each SKU
  let i = 0
  for (const [sku, name] of parentSkus) {
    i++
    const pdfUrl = `${BASE_URL}/${sku}.pdf`

    process.stdout.write(`[${i}/${parentSkus.size}] Checking ${sku}... `)

    const { exists, statusCode, contentType } = await checkPdfExists(pdfUrl)

    if (exists) {
      console.log("✅ FOUND")
      foundCount++
      results.push({
        sku,
        name,
        pdfUrl,
        status: "found",
        statusCode,
        contentType
      })
    } else if (statusCode === 404) {
      console.log("❌ Not found")
      notFoundCount++
      results.push({
        sku,
        name,
        pdfUrl,
        status: "not_found",
        statusCode
      })
    } else {
      console.log(`⚠️ Error (${statusCode})`)
      results.push({
        sku,
        name,
        pdfUrl,
        status: "error",
        statusCode
      })
    }

    // Rate limiting - small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Save results
  const output = {
    scannedAt: new Date().toISOString(),
    totalSkus: parentSkus.size,
    found: foundCount,
    notFound: notFoundCount,
    results: results.sort((a, b) => {
      // Sort found first, then by SKU
      if (a.status === "found" && b.status !== "found") return -1
      if (a.status !== "found" && b.status === "found") return 1
      return a.sku.localeCompare(b.sku)
    })
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))

  console.log("\n" + "=".repeat(50))
  console.log("📊 Scan Complete!")
  console.log("=".repeat(50))
  console.log(`Total SKUs scanned: ${parentSkus.size}`)
  console.log(`✅ PDFs found: ${foundCount}`)
  console.log(`❌ Not found: ${notFoundCount}`)
  console.log(`\nResults saved to: ${OUTPUT_PATH}`)

  if (foundCount > 0) {
    console.log("\n📄 Datasheets Found:")
    for (const r of results.filter(r => r.status === "found")) {
      console.log(`  - ${r.sku}: ${r.pdfUrl}`)
    }
  }
}

main().catch(console.error)
