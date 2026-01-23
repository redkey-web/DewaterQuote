/**
 * Australian Free Shipping Postcode Detection
 *
 * Includes metro areas AND regional centers with freight depots.
 * Areas with StarTrack, Toll, FedEx, TNT depots qualify for free shipping.
 *
 * Last updated: January 2025
 * Source: Australia Post delivery zones + major freight carrier depot locations
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

  // ============================================
  // REGIONAL CENTERS WITH FREIGHT DEPOTS
  // (StarTrack, Toll, FedEx, TNT distribution)
  // ============================================

  // Western Australia - Regional with Depots
  {
    name: "Geraldton",
    state: "WA",
    ranges: [
      [6530, 6532], // Geraldton
    ],
  },
  {
    name: "Kalgoorlie",
    state: "WA",
    ranges: [
      [6430, 6433], // Kalgoorlie-Boulder
    ],
  },
  {
    name: "Albany",
    state: "WA",
    ranges: [
      [6330, 6333], // Albany
    ],
  },
  {
    name: "Karratha",
    state: "WA",
    ranges: [
      [6714, 6714], // Karratha
    ],
  },
  {
    name: "Port Hedland",
    state: "WA",
    ranges: [
      [6721, 6722], // Port Hedland / South Hedland
    ],
  },

  // New South Wales - Regional with Depots
  {
    name: "Dubbo",
    state: "NSW",
    ranges: [
      [2830, 2832], // Dubbo
    ],
  },
  {
    name: "Wagga Wagga",
    state: "NSW",
    ranges: [
      [2650, 2652], // Wagga Wagga
    ],
  },
  {
    name: "Albury",
    state: "NSW",
    ranges: [
      [2640, 2641], // Albury
    ],
  },
  {
    name: "Tamworth",
    state: "NSW",
    ranges: [
      [2340, 2341], // Tamworth
    ],
  },
  {
    name: "Orange",
    state: "NSW",
    ranges: [
      [2800, 2800], // Orange
    ],
  },
  {
    name: "Bathurst",
    state: "NSW",
    ranges: [
      [2795, 2795], // Bathurst
    ],
  },
  {
    name: "Coffs Harbour",
    state: "NSW",
    ranges: [
      [2450, 2452], // Coffs Harbour
    ],
  },
  {
    name: "Lismore",
    state: "NSW",
    ranges: [
      [2480, 2480], // Lismore
    ],
  },
  {
    name: "Port Macquarie",
    state: "NSW",
    ranges: [
      [2444, 2446], // Port Macquarie
    ],
  },

  // Victoria - Regional with Depots
  {
    name: "Ballarat",
    state: "VIC",
    ranges: [
      [3350, 3356], // Ballarat
    ],
  },
  {
    name: "Bendigo",
    state: "VIC",
    ranges: [
      [3550, 3556], // Bendigo
    ],
  },
  {
    name: "Shepparton",
    state: "VIC",
    ranges: [
      [3630, 3632], // Shepparton
    ],
  },
  {
    name: "Wodonga",
    state: "VIC",
    ranges: [
      [3690, 3691], // Wodonga
    ],
  },
  {
    name: "Warrnambool",
    state: "VIC",
    ranges: [
      [3280, 3282], // Warrnambool
    ],
  },
  {
    name: "Traralgon",
    state: "VIC",
    ranges: [
      [3840, 3844], // Traralgon / Latrobe Valley
    ],
  },

  // Queensland - Regional with Depots
  {
    name: "Townsville",
    state: "QLD",
    ranges: [
      [4810, 4818], // Townsville
    ],
  },
  {
    name: "Cairns",
    state: "QLD",
    ranges: [
      [4868, 4881], // Cairns
    ],
  },
  {
    name: "Rockhampton",
    state: "QLD",
    ranges: [
      [4700, 4703], // Rockhampton
    ],
  },
  {
    name: "Mackay",
    state: "QLD",
    ranges: [
      [4740, 4741], // Mackay
    ],
  },
  {
    name: "Toowoomba",
    state: "QLD",
    ranges: [
      [4350, 4352], // Toowoomba
    ],
  },
  {
    name: "Bundaberg",
    state: "QLD",
    ranges: [
      [4670, 4671], // Bundaberg
    ],
  },
  {
    name: "Gladstone",
    state: "QLD",
    ranges: [
      [4680, 4680], // Gladstone
    ],
  },
  {
    name: "Sunshine Coast",
    state: "QLD",
    ranges: [
      [4550, 4575], // Sunshine Coast
    ],
  },

  // South Australia - Regional with Depots
  {
    name: "Mount Gambier",
    state: "SA",
    ranges: [
      [5290, 5291], // Mount Gambier
    ],
  },
  {
    name: "Port Augusta",
    state: "SA",
    ranges: [
      [5700, 5701], // Port Augusta
    ],
  },
  {
    name: "Whyalla",
    state: "SA",
    ranges: [
      [5600, 5601], // Whyalla
    ],
  },

  // Tasmania - Regional with Depots
  {
    name: "Launceston",
    state: "TAS",
    ranges: [
      [7248, 7258], // Launceston
    ],
  },
  {
    name: "Devonport",
    state: "TAS",
    ranges: [
      [7310, 7310], // Devonport
    ],
  },
  {
    name: "Burnie",
    state: "TAS",
    ranges: [
      [7320, 7321], // Burnie
    ],
  },

  // Northern Territory - Regional with Depots
  {
    name: "Alice Springs",
    state: "NT",
    ranges: [
      [870, 872], // Alice Springs (note: 3-digit postcodes)
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
      message: 'Free delivery to ${result.region}',
      shortMessage: "Free delivery",
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
