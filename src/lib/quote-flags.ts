/**
 * Quote Exception Detection
 * Helps staff quickly identify quotes needing special attention
 */

// Lead time priority order (higher index = longer time)
const LEAD_TIME_ORDER = [
  "In Stock",
  "1 week",
  "1-2 weeks",
  "2-3 weeks",
  "2-4 weeks",
  "3-4 weeks",
  "4-6 weeks",
  "6-8 weeks",
  "8+ weeks",
]

// Long lead time threshold - items >= this index are flagged
const LONG_LEAD_TIME_THRESHOLD = 6 // "4-6 weeks" and above

/**
 * Exception flags for business email
 */
export interface QuoteExceptionFlags {
  isNonMetro: boolean
  isRemote: boolean
  isLargeOrder: boolean // >10 total items
  hasLongLeadTime: boolean // any item with 4+ weeks lead time
  longLeadTimeItems: string[] // names of items with long lead times
  totalQuantity: number
  deliveryZone: "metro" | "regional" | "remote"
}

interface QuoteItemForFlags {
  name: string
  quantity: number
  leadTime?: string
}

/**
 * Detect exception conditions that need staff attention
 */
export function detectExceptions(
  items: QuoteItemForFlags[],
  deliveryClassification: { zone: "metro" | "regional" | "remote" }
): QuoteExceptionFlags {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  // Find items with long lead times (4+ weeks)
  const longLeadTimeItems: string[] = []
  for (const item of items) {
    if (!item.leadTime) continue
    const idx = LEAD_TIME_ORDER.findIndex((lt) =>
      item.leadTime?.toLowerCase().includes(lt.toLowerCase())
    )
    if (idx >= LONG_LEAD_TIME_THRESHOLD) {
      longLeadTimeItems.push(`${item.name} (${item.leadTime})`)
    }
  }

  return {
    isNonMetro: deliveryClassification.zone !== "metro",
    isRemote: deliveryClassification.zone === "remote",
    isLargeOrder: totalQuantity > 10,
    hasLongLeadTime: longLeadTimeItems.length > 0,
    longLeadTimeItems,
    totalQuantity,
    deliveryZone: deliveryClassification.zone,
  }
}

/**
 * Generate HTML for flags section in business email
 * Returns a status box - green for standard, amber with flags for exceptions
 */
export function generateFlagsHtml(flags: QuoteExceptionFlags): string {
  const flagItems: string[] = []

  if (flags.isRemote) {
    flagItems.push(`
      <div style="display: inline-block; background: #dc2626; color: white; padding: 6px 12px; border-radius: 4px; margin: 4px; font-weight: 600;">
        🚛 REMOTE/MINE SITE
      </div>
    `)
  } else if (flags.isNonMetro) {
    flagItems.push(`
      <div style="display: inline-block; background: #f59e0b; color: white; padding: 6px 12px; border-radius: 4px; margin: 4px; font-weight: 600;">
        📍 NON-METRO DELIVERY
      </div>
    `)
  }

  if (flags.isLargeOrder) {
    flagItems.push(`
      <div style="display: inline-block; background: #7c3aed; color: white; padding: 6px 12px; border-radius: 4px; margin: 4px; font-weight: 600;">
        📦 LARGE ORDER (${flags.totalQuantity} items)
      </div>
    `)
  }

  if (flags.hasLongLeadTime) {
    flagItems.push(`
      <div style="display: inline-block; background: #0369a1; color: white; padding: 6px 12px; border-radius: 4px; margin: 4px; font-weight: 600;">
        ⏳ LONG LEAD TIME
      </div>
    `)
  }

  // If no flags, return green "standard" box
  if (flagItems.length === 0) {
    return `
      <div style="background: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
        <p style="margin: 0; color: #166534; font-weight: 600;">
          ✅ Standard Quote - No special handling required
        </p>
      </div>
    `
  }

  // Build flags section with amber background
  let html = `
    <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #92400e; font-size: 14px;">
        ⚠️ FLAGS - Review Required:
      </p>
      <div style="margin-bottom: 8px;">
        ${flagItems.join("")}
      </div>
  `

  // Add details for long lead time items
  if (flags.hasLongLeadTime && flags.longLeadTimeItems.length > 0) {
    html += `
      <p style="margin: 8px 0 0; font-size: 12px; color: #78350f;">
        <strong>Long lead time items:</strong> ${flags.longLeadTimeItems.join(", ")}
      </p>
    `
  }

  // Add delivery note for non-metro
  if (flags.isNonMetro) {
    html += `
      <p style="margin: 8px 0 0; font-size: 12px; color: #78350f;">
        <strong>Delivery:</strong> ${flags.isRemote ? "Remote/mine site - custom freight quote required" : "Regional delivery - confirm shipping cost"}
      </p>
    `
  }

  html += `</div>`
  return html
}

/**
 * Generate plain text flags for email text version
 */
export function generateFlagsText(flags: QuoteExceptionFlags): string {
  if (!flags.isNonMetro && !flags.isLargeOrder && !flags.hasLongLeadTime) {
    return "✅ Standard Quote - No special handling required"
  }

  const lines: string[] = ["FLAGS:"]

  if (flags.isRemote) {
    lines.push("- REMOTE/MINE SITE - custom freight quote required")
  } else if (flags.isNonMetro) {
    lines.push("- NON-METRO DELIVERY - confirm shipping cost")
  }

  if (flags.isLargeOrder) {
    lines.push(`- LARGE ORDER (${flags.totalQuantity} items)`)
  }

  if (flags.hasLongLeadTime) {
    lines.push(`- LONG LEAD TIME items: ${flags.longLeadTimeItems.join(", ")}`)
  }

  return lines.join("\n")
}
