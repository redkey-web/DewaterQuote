/**
 * Australian Metropolitan Postcode Detection
 *
 * Based on Australia Post and common freight carrier definitions.
 * Metro areas typically receive free or standard-rate shipping.
 *
 * Last updated: January 2025
 * Source: Australia Post delivery zones + major freight carriers
 */

// Postcode ranges for Australian metropolitan areas
// Format: [start, end] inclusive ranges
type PostcodeRange = [number, number]

interface MetroRegion {
  name: string
  state: string
  ranges: PostcodeRange[]
}

const METRO_REGIONS: MetroRegion[] = [
  // Western Australia - Perth Metro
  {
    name: "Perth",
    state: "WA",
    ranges: [
      [6000, 6199], // Perth CBD and inner suburbs
      [6200, 6214], // Mandurah area (often included in Perth metro)
    ],
  },

  // New South Wales - Sydney Metro
  {
    name: "Sydney",
    state: "NSW",
    ranges: [
      [2000, 2249], // Sydney CBD to Northern Beaches
      [2555, 2574], // Campbelltown/Macarthur
      [2740, 2786], // Penrith to Blue Mountains fringe
    ],
  },

  // Victoria - Melbourne Metro
  {
    name: "Melbourne",
    state: "VIC",
    ranges: [
      [3000, 3210], // Melbourne CBD and inner suburbs
      [3335, 3341], // Melton area
      [3427, 3442], // Sunbury area
      [3750, 3810], // Outer eastern suburbs
      [3910, 3978], // Mornington Peninsula (metro portion)
    ],
  },

  // Queensland - Brisbane Metro
  {
    name: "Brisbane",
    state: "QLD",
    ranges: [
      [4000, 4209], // Brisbane CBD and suburbs
      [4300, 4306], // Springfield/Ipswich fringe
      [4500, 4521], // North Lakes/Moreton Bay
    ],
  },

  // South Australia - Adelaide Metro
  {
    name: "Adelaide",
    state: "SA",
    ranges: [
      [5000, 5199], // Adelaide CBD and suburbs
    ],
  },

  // Australian Capital Territory - Canberra
  {
    name: "Canberra",
    state: "ACT",
    ranges: [
      [2600, 2620], // Canberra
      [2900, 2920], // Tuggeranong/Queanbeyan area
    ],
  },

  // Tasmania - Hobart Metro
  {
    name: "Hobart",
    state: "TAS",
    ranges: [
      [7000, 7099], // Hobart and surrounds
      [7170, 7179], // Kingston area
    ],
  },

  // Northern Territory - Darwin Metro
  {
    name: "Darwin",
    state: "NT",
    ranges: [
      [800, 899],   // Darwin and surrounds (note: 3-digit postcodes)
    ],
  },

  // Gold Coast (often considered metro for shipping)
  {
    name: "Gold Coast",
    state: "QLD",
    ranges: [
      [4207, 4230], // Gold Coast
    ],
  },

  // Newcastle/Hunter (often metro rates)
  {
    name: "Newcastle",
    state: "NSW",
    ranges: [
      [2280, 2330], // Newcastle and Hunter region
    ],
  },

  // Wollongong/Illawarra (often metro rates)
  {
    name: "Wollongong",
    state: "NSW",
    ranges: [
      [2500, 2535], // Wollongong and surrounds
    ],
  },

  // Geelong (often metro rates from Melbourne)
  {
    name: "Geelong",
    state: "VIC",
    ranges: [
      [3211, 3227], // Geelong area
    ],
  },
]

/**
 * Check if a postcode is in a metropolitan area
 * @param postcode - Australian postcode (string or number)
 * @returns Object with isMetro boolean and region details if metro
 */
export function checkMetroPostcode(postcode: string | number): {
  isMetro: boolean
  region?: string
  state?: string
} {
  // Normalize postcode to number
  const pc = typeof postcode === "string" ? parseInt(postcode, 10) : postcode

  // Validate postcode
  if (isNaN(pc) || pc < 200 || pc > 9999) {
    return { isMetro: false }
  }

  // Check against all metro regions
  for (const region of METRO_REGIONS) {
    for (const [start, end] of region.ranges) {
      if (pc >= start && pc <= end) {
        return {
          isMetro: true,
          region: region.name,
          state: region.state,
        }
      }
    }
  }

  return { isMetro: false }
}

/**
 * Simple boolean check for metro postcode
 */
export function isMetroPostcode(postcode: string | number): boolean {
  return checkMetroPostcode(postcode).isMetro
}

/**
 * Get shipping message based on postcode
 */
export function getShippingMessage(postcode: string | number): {
  isFreeShipping: boolean
  message: string
  shortMessage: string
} {
  const result = checkMetroPostcode(postcode)

  if (result.isMetro) {
    return {
      isFreeShipping: true,
      message: `Free delivery to ${result.region} metro area`,
      shortMessage: "Free metro delivery",
    }
  }

  return {
    isFreeShipping: false,
    message: "Regional delivery - shipping will be quoted separately",
    shortMessage: "Shipping quoted separately",
  }
}

/**
 * Get all metro regions (useful for displaying info)
 */
export function getMetroRegions(): { name: string; state: string }[] {
  return METRO_REGIONS.map(r => ({ name: r.name, state: r.state }))
}
