/**
 * Australian Postcode Classification
 * Determines if a postcode is metro (free delivery) or non-metro (delivery TBC)
 */

// Metro postcode ranges by city
const METRO_RANGES: Record<string, [number, number][]> = {
  // Perth metropolitan area
  perth: [
    [6000, 6199], // Perth CBD and inner suburbs
    [6200, 6214], // Rockingham, Kwinana
    [6215, 6239], // Mandurah (considered metro for delivery)
  ],
  // Sydney metropolitan area
  sydney: [
    [2000, 2249], // Sydney CBD and surrounds
    [2555, 2574], // Campbelltown, Liverpool area
    [2740, 2786], // Penrith, Blue Mountains fringe
  ],
  // Melbourne metropolitan area
  melbourne: [
    [3000, 3207], // Melbourne CBD and inner suburbs
    [3335, 3341], // Melton area
    [3427, 3429], // Sunbury area
    [3750, 3810], // Outer eastern suburbs
    [3910, 3978], // Mornington Peninsula
  ],
  // Brisbane metropolitan area
  brisbane: [
    [4000, 4179], // Brisbane CBD and inner suburbs
    [4205, 4275], // Gold Coast considered metro
    [4500, 4519], // North Brisbane
  ],
  // Adelaide metropolitan area
  adelaide: [
    [5000, 5199], // Adelaide CBD and surrounds
  ],
}

/**
 * Check if a postcode falls within any metro range
 */
function isInMetroRange(postcode: number): boolean {
  for (const city of Object.values(METRO_RANGES)) {
    for (const [min, max] of city) {
      if (postcode >= min && postcode <= max) {
        return true
      }
    }
  }
  return false
}

/**
 * Detect if address might be a mine site or remote location
 * based on keywords in the address
 */
function isMineOrRemote(address: string): boolean {
  const lowerAddress = address.toLowerCase()
  const mineKeywords = [
    'mine',
    'mining',
    'quarry',
    'pit',
    'camp',
    'site',
    'station',
    'pastoral',
    'remote',
  ]
  return mineKeywords.some(keyword => lowerAddress.includes(keyword))
}

export type DeliveryZone = 'metro' | 'regional' | 'remote'

export interface DeliveryClassification {
  zone: DeliveryZone
  isFreeDelivery: boolean
  deliveryNote: string
}

/**
 * Classify delivery based on postcode and address
 * @param postcode - Australian postcode (4 digits)
 * @param address - Optional full address for mine/remote detection
 * @returns Delivery classification with zone and note
 */
export function classifyDelivery(
  postcode: string,
  address?: string
): DeliveryClassification {
  const postcodeNum = parseInt(postcode, 10)

  // Invalid postcode
  if (isNaN(postcodeNum) || postcode.length !== 4) {
    return {
      zone: 'regional',
      isFreeDelivery: false,
      deliveryNote: 'Delivery to be confirmed',
    }
  }

  // Check for mine/remote in address
  if (address && isMineOrRemote(address)) {
    return {
      zone: 'remote',
      isFreeDelivery: false,
      deliveryNote: 'Remote/mine site - delivery quoted separately',
    }
  }

  // Check if metro
  if (isInMetroRange(postcodeNum)) {
    return {
      zone: 'metro',
      isFreeDelivery: true,
      deliveryNote: 'Free metro delivery',
    }
  }

  // Non-metro / regional
  return {
    zone: 'regional',
    isFreeDelivery: false,
    deliveryNote: 'Delivery to be confirmed',
  }
}

/**
 * Simple check for metro postcode
 */
export function isMetroPostcode(postcode: string): boolean {
  const postcodeNum = parseInt(postcode, 10)
  if (isNaN(postcodeNum)) return false
  return isInMetroRange(postcodeNum)
}

/**
 * Get delivery note for display
 */
export function getDeliveryNote(
  postcode: string,
  street?: string,
  suburb?: string
): string {
  const fullAddress = [street, suburb].filter(Boolean).join(' ')
  const classification = classifyDelivery(postcode, fullAddress)
  return classification.deliveryNote
}
