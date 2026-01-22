import { MetadataRoute } from "next"
// Use static catalog for build-time sitemap generation (avoids DB dependency)
import {
  products as catalogProducts,
  categories as catalogCategories,
  subcategories as catalogSubcategories,
} from "@/data/catalog"

const BASE_URL = "https://dewaterproducts.com.au"

// Map subcategory slugs to flat page URLs
const subcategoryToFlatUrl: Record<string, string> = {
  // Valves
  'butterfly-valve': '/butterfly-valves',
  'check-valve': '/check-valves',
  'swing-check-valve': '/check-valves',
  'duckbill-check-valve': '/duckbill-check-valves',
  'ball-check-valve': '/ball-valves',
  'gate-valve': '/gate-valves',
  'ball-valve': '/ball-valves',
  'float-valve': '/float-valves',
  'foot-valve': '/foot-valves',
  // Expansion joints
  'single-sphere': '/single-sphere-expansion-joints',
  'twin-sphere': '/twin-sphere-expansion-joints',
  'single-arch': '/single-arch-expansion-joints',
  'double-arch': '/double-arch-expansion-joints',
  'reducing': '/reducing-expansion-joints',
  'triple-arch': '/triple-arch-expansion-joints',
  'quadruple-arch': '/quadruple-arch-expansion-joints',
  'ptfe-lined': '/ptfe-lined-expansion-joints',
  // Strainers
  'y-strainer': '/y-strainers',
  'simplex-basket-strainer': '/basket-strainers',
  'duplex-basket-strainer': '/duplex-basket-strainers',
  'flanged-suction-strainer': '/flanged-suction-strainers',
}

// Map brand slugs to their dedicated URLs
const brandToUrl: Record<string, string> = {
  'straub': '/straub-couplings',
  'orbit': '/orbit-couplings',
  'teekay': '/teekay',
  'bore-flex-rubber': '/bore-flex',
  'defender-valves': '/defender-valves',
  'defender-strainers': '/defender-strainers',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Use static catalog data for build-time sitemap (no DB required)
  const products = catalogProducts
  const categories = catalogCategories
  const subcategories = catalogSubcategories
  // Static brand list (matches brandToUrl keys)
  const allBrands = [
    { slug: 'straub' },
    { slug: 'orbit' },
    { slug: 'teekay' },
    { slug: 'bore-flex-rubber' },
    { slug: 'defender-valves' },
    { slug: 'defender-strainers' },
  ]

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/request-quote`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/brands`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/industrial-valves`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/expansion-joints`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/strainers`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/pipe-repair-clamps`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/bore-flex`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/duckbill-check-valves`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE_URL}/muff-couplings`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ]

  // Category pages (from database) - excluding 'valves' which is now 'industrial-valves'
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter(cat => cat.slug !== 'valves') // handled in static pages as industrial-valves
    .map((category) => ({
      url: `${BASE_URL}/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

  // Flat subcategory pages (using the mapping)
  const flatSubcategoryUrls = new Set<string>()
  subcategories.forEach((subcat) => {
    const flatUrl = subcategoryToFlatUrl[subcat.slug]
    if (flatUrl) {
      flatSubcategoryUrls.add(flatUrl)
    }
  })

  const subcategoryPages: MetadataRoute.Sitemap = Array.from(flatSubcategoryUrls).map((url) => ({
    url: `${BASE_URL}${url}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }))

  // Product detail pages (root-level URLs)
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Brand pages (from database, using URL mapping)
  const brandPages: MetadataRoute.Sitemap = allBrands.map((brand) => {
    const url = brandToUrl[brand.slug] || `/brands/${brand.slug}`
    const isTopBrand = ['straub', 'orbit'].includes(brand.slug)
    return {
      url: `${BASE_URL}${url}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: isTopBrand ? 0.9 : 0.75,
    }
  })

  // Industry pages
  const industryPages: MetadataRoute.Sitemap = [
    "water-wastewater",
    "irrigation",
    "fire-services",
    "mining",
    "marine",
    "hvac",
    "food-beverage",
  ].map((industry) => ({
    url: `${BASE_URL}/industries/${industry}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
    ...productPages,
    ...brandPages,
    ...industryPages,
  ]
}
