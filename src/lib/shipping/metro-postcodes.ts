/**
 * Australian Shipping Zone Detection
 *
 * Three shipping tiers:
 * 1. Metro Areas - FREE shipping
 * 2. Major Regional (freight depots) - $100 flat rate
 * 3. Remote/Other - Quote required
 *
 * Last updated: January 2025
 * Source: Australia Post delivery zones + major freight carrier depot locations
 */

// Postcode ranges format: [start, end] inclusive
type PostcodeRange = [number, number]

interface ShippingRegion {
  name: string
  state: string
  ranges: PostcodeRange[]
}

// Shipping zone types
export type ShippingZone = "metro" | "major_regional" | "remote"

// Shipping costs by zone
export const SHIPPING_COSTS: Record<ShippingZone, number | null> = {
  metro: 0,
  major_regional: 100,
  remote: null, // Quote required
}

// ============================================
// METRO AREAS - FREE SHIPPING
// ============================================
const METRO_REGIONS: ShippingRegion[] = [
  // Western Australia - Perth Metro
  {
    name: "Perth",
    state: "WA",
    ranges: [
      [6000, 6199], // Perth CBD and inner suburbs
      [6200, 6214], // Mandurah area (often included in Perth metro)
    ],
  },
  // Western Australia - Bunbury
  {
    name: "Bunbury",
    state: "WA",
    ranges: [
      [6230, 6239], // Bunbury and surrounds
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
      [800, 899], // Darwin and surrounds (note: 3-digit postcodes)
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

// ============================================
// MAJOR REGIONAL AREAS - $100 SHIPPING
// (StarTrack, Toll, FedEx, TNT freight depots)
// ============================================
const MAJOR_REGIONAL_REGIONS: ShippingRegion[] = [
  // Western Australia - Regional with Depots
  {
    name: "Geraldton",
    state: "WA",
    ranges: [[6530, 6532]],
  },
  {
    name: "Kalgoorlie",
    state: "WA",
    ranges: [[6430, 6433]],
  },
  {
    name: "Albany",
    state: "WA",
    ranges: [[6330, 6333]],
  },
  {
    name: "Karratha",
    state: "WA",
    ranges: [[6714, 6714]],
  },
  {
    name: "Port Hedland",
    state: "WA",
    ranges: [[6721, 6722]],
  },
  // New South Wales - Regional with Depots
  {
    name: "Dubbo",
    state: "NSW",
    ranges: [[2830, 2832]],
  },
  {
    name: "Wagga Wagga",
    state: "NSW",
    ranges: [[2650, 2652]],
  },
  {
    name: "Albury",
    state: "NSW",
    ranges: [[2640, 2641]],
  },
  {
    name: "Tamworth",
    state: "NSW",
    ranges: [[2340, 2341]],
  },
  {
    name: "Orange",
    state: "NSW",
    ranges: [[2800, 2800]],
  },
  {
    name: "Bathurst",
    state: "NSW",
    ranges: [[2795, 2795]],
  },
  {
    name: "Coffs Harbour",
    state: "NSW",
    ranges: [[2450, 2452]],
  },
  {
    name: "Lismore",
    state: "NSW",
    ranges: [[2480, 2480]],
  },
  {
    name: "Port Macquarie",
    state: "NSW",
    ranges: [[2444, 2446]],
  },
  // Victoria - Regional with Depots
  {
    name: "Ballarat",
    state: "VIC",
    ranges: [[3350, 3356]],
  },
  {
    name: "Bendigo",
    state: "VIC",
    ranges: [[3550, 3556]],
  },
  {
    name: "Shepparton",
    state: "VIC",
    ranges: [[3630, 3632]],
  },
  {
    name: "Wodonga",
    state: "VIC",
    ranges: [[3690, 3691]],
  },
  {
    name: "Warrnambool",
    state: "VIC",
    ranges: [[3280, 3282]],
  },
  {
    name: "Traralgon",
    state: "VIC",
    ranges: [[3840, 3844]],
  },
  // Queensland - Regional with Depots
  {
    name: "Townsville",
    state: "QLD",
    ranges: [[4810, 4818]],
  },
  {
    name: "Cairns",
    state: "QLD",
    ranges: [[4868, 4881]],
  },
  {
    name: "Rockhampton",
    state: "QLD",
    ranges: [[4700, 4703]],
  },
  {
    name: "Mackay",
    state: "QLD",
    ranges: [[4740, 4741]],
  },
  {
    name: "Toowoomba",
    state: "QLD",
    ranges: [[4350, 4352]],
  },
  {
    name: "Bundaberg",
    state: "QLD",
    ranges: [[4670, 4671]],
  },
  {
    name: "Gladstone",
    state: "QLD",
    ranges: [[4680, 4680]],
  },
  {
    name: "Sunshine Coast",
    state: "QLD",
    ranges: [[4550, 4575]],
  },
  // South Australia - Regional with Depots
  {
    name: "Mount Gambier",
    state: "SA",
    ranges: [[5290, 5291]],
  },
  {
    name: "Port Augusta",
    state: "SA",
    ranges: [[5700, 5701]],
  },
  {
    name: "Whyalla",
    state: "SA",
    ranges: [[5600, 5601]],
  },
  // Tasmania - Regional with Depots
  {
    name: "Launceston",
    state: "TAS",
    ranges: [[7248, 7258]],
  },
  {
    name: "Devonport",
    state: "TAS",
    ranges: [[7310, 7310]],
  },
  {
    name: "Burnie",
    state: "TAS",
    ranges: [[7320, 7321]],
  },
  // Northern Territory - Regional with Depots
  {
    name: "Alice Springs",
    state: "NT",
    ranges: [[870, 872]],
  },
]

/**
 * Check shipping zone for a postcode
 * @param postcode - Australian postcode (string or number)
 * @returns Object with zone type, region details, and shipping cost
 */
export function checkShippingZone(postcode: string | number): {
  zone: ShippingZone
  region?: string
  state?: string
  shippingCost: number | null
  isFreeShipping: boolean
} {
  // Normalize postcode to number
  const pc = typeof postcode === "string" ? parseInt(postcode, 10) : postcode

  // Validate postcode
  if (isNaN(pc) || pc < 200 || pc > 9999) {
    return {
      zone: "remote",
      shippingCost: null,
      isFreeShipping: false,
    }
  }

  // Check metro regions first (free shipping)
  for (const region of METRO_REGIONS) {
    for (const [start, end] of region.ranges) {
      if (pc >= start && pc <= end) {
        return {
          zone: "metro",
          region: region.name,
          state: region.state,
          shippingCost: SHIPPING_COSTS.metro,
          isFreeShipping: true,
        }
      }
    }
  }

  // Check major regional areas ($100 shipping)
  for (const region of MAJOR_REGIONAL_REGIONS) {
    for (const [start, end] of region.ranges) {
      if (pc >= start && pc <= end) {
        return {
          zone: "major_regional",
          region: region.name,
          state: region.state,
          shippingCost: SHIPPING_COSTS.major_regional,
          isFreeShipping: false,
        }
      }
    }
  }

  // Remote area - quote required
  return {
    zone: "remote",
    shippingCost: null,
    isFreeShipping: false,
  }
}

/**
 * Legacy function - Check if a postcode is in a serviceable area (metro or major regional)
 * @deprecated Use checkShippingZone instead
 */
export function checkMetroPostcode(postcode: string | number): {
  isMetro: boolean
  region?: string
  state?: string
} {
  const result = checkShippingZone(postcode)
  return {
    isMetro: result.zone !== "remote",
    region: result.region,
    state: result.state,
  }
}

/**
 * Legacy function - Simple boolean check for serviceable postcode
 * @deprecated Use checkShippingZone instead
 */
export function isMetroPostcode(postcode: string | number): boolean {
  return checkShippingZone(postcode).zone !== "remote"
}

/**
 * Get shipping message based on postcode
 */
export function getShippingMessage(postcode: string | number): {
  isFreeShipping: boolean
  shippingCost: number | null
  zone: ShippingZone
  message: string
  shortMessage: string
} {
  const result = checkShippingZone(postcode)

  if (result.zone === "metro") {
    return {
      isFreeShipping: true,
      shippingCost: 0,
      zone: "metro",
      message: "Free delivery to " + result.region,
      shortMessage: "Free delivery",
    }
  }

  if (result.zone === "major_regional") {
    return {
      isFreeShipping: false,
      shippingCost: SHIPPING_COSTS.major_regional,
      zone: "major_regional",
      message: "$100 delivery to " + result.region + " (Major Regional Area)",
      shortMessage: "$100 delivery",
    }
  }

  return {
    isFreeShipping: false,
    shippingCost: null,
    zone: "remote",
    message: "Remote area - shipping will be quoted separately",
    shortMessage: "Shipping quoted separately",
  }
}

/**
 * Get all regions by zone type
 */
export function getRegionsByZone(zone: ShippingZone): { name: string; state: string }[] {
  if (zone === "metro") {
    return METRO_REGIONS.map((r) => ({ name: r.name, state: r.state }))
  }
  if (zone === "major_regional") {
    return MAJOR_REGIONAL_REGIONS.map((r) => ({ name: r.name, state: r.state }))
  }
  return []
}

/**
 * Legacy function - Get all metro regions
 * @deprecated Use getRegionsByZone('metro') instead
 */
export function getMetroRegions(): { name: string; state: string }[] {
  return getRegionsByZone("metro")
}
