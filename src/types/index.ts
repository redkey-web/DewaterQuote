// Product Catalog Types
export interface MediaAsset {
  url: string
  alt: string
  type?: 'image' | 'video'
}

export interface SpecEntry {
  label: string
  value: string
}

export interface SizeOption {
  value: string
  label: string
  price?: number
  sku?: string
}

export interface ProductVideo {
  id: number
  youtubeId: string
  title: string | null
  sizeLabel: string | null
  isPrimary: boolean
  isActive: boolean
}

export interface Product {
  id: string
  slug: string
  sku: string
  name: string
  shortName?: string
  brand: string
  category: string
  subcategory?: string
  description: string
  features?: string[]
  specifications: SpecEntry[]
  sizeOptions?: SizeOption[]
  images: MediaAsset[]
  downloads?: { url: string; label: string }[]
  video?: string // Primary video URL (backwards compat)
  videos?: ProductVideo[] // All videos
  leadTime?: string
  materials: {
    body: string
    seat?: string
    disc?: string
    sleeve?: string
  }
  pressureRange: string
  sizeFrom?: string
  temperature?: string
  applications?: string[]
  certifications?: string
  price?: number
  priceVaries?: boolean
  priceNote?: string
  straubEquivalent?: string // Cross-reference to Straub equivalent product
}

export interface Subcategory {
  id: string
  slug: string
  name: string
  description: string
  image?: string
  category: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  longDescription?: string
  image?: string
  subcategories?: Subcategory[]
}

// Quote Cart Types
export interface QuoteItemVariation {
  size: string
  sizeLabel: string
  sku: string
  unitPrice: number
}

export interface QuoteItem {
  id: string
  productId: string
  name: string
  brand: string
  category: string
  image: string
  basePrice?: number
  baseSku?: string
  priceVaries: boolean
  variation?: QuoteItemVariation
  quantity: number
  materialTestCert?: boolean
  leadTime?: string // e.g., "2-3 weeks", "In Stock", "7 weeks FRO"
}
