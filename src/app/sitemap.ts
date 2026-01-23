import { MetadataRoute } from "next"
// Use static catalog for build-time sitemap generation (avoids DB dependency)
import {
  products as catalogProducts,
  categories as catalogCategories,
  subcategories as catalogSubcategories,
} from "@/data/catalog"

const BASE_URL = "https://dewaterproducts.com.au"

// Map subcategory slugs to nested page URLs
const subcategoryToNestedUrl: Record<string, string> = {
  // Valves
  'butterfly-valve': '/industrial-valves/butterfly-valves',
  'check-valve': '/industrial-valves/check-valves',
  'check-valves': '/industrial-valves/check-valves',
  'swing-check-valve': '/industrial-valves/check-valves',
  'duckbill-check-valve': '/industrial-valves/duckbill-valves',
  'ball-check-valve': '/industrial-valves/ball-valves',
  'gate-valve': '/industrial-valves/gate-valves',
  'ball-valve': '/industrial-valves/ball-valves',
  'float-valve': '/industrial-valves/float-valves',
  'foot-valve': '/industrial-valves/foot-valves',
  // Expansion joints
  'single-sphere': '/expansion-joints/single-sphere',
  'twin-sphere': '/expansion-joints/twin-sphere',
  'single-arch': '/expansion-joints/single-arch',
  'double-arch': '/expansion-joints/double-arch',
  'reducing': '/expansion-joints/reducing',
  'triple-arch': '/expansion-joints/triple-arch',
  'quadruple-arch': '/expansion-joints/quadruple-arch',
  'ptfe-lined': '/expansion-joints/ptfe-lined',
  // Strainers
  'y-strainer': '/strainers/y-strainers',
  'simplex-basket-strainer': '/strainers/basket-strainers',
  'duplex-basket-strainer': '/strainers/duplex-strainers',
  'flanged-suction-strainer': '/strainers/suction-strainers',
}

// Map brand slugs to their dedicated URLs
const brandToUrl: Record<string, string> = {
  'straub': '/pipe-couplings/straub',
  'orbit': '/pipe-couplings/orbit',
  'teekay': '/pipe-couplings/teekay',
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

  // Static pages - hub pages and standalone pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/request-quote`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/brands`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Hub pages
    { url: `${BASE_URL}/industrial-valves`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/expansion-joints`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/strainers`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/pipe-couplings`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    // Standalone pages
    { url: `${BASE_URL}/pipe-repair-clamps`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/flange-adaptors`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/bore-flex`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/defender-valves`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE_URL}/defender-strainers`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    // Nested brand pages under pipe-couplings
    { url: `${BASE_URL}/pipe-couplings/straub`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/pipe-couplings/orbit`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/pipe-couplings/teekay`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/pipe-couplings/muff-couplings`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
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

  // Nested subcategory pages (using the mapping)
  const nestedSubcategoryUrls = new Set<string>()
  subcategories.forEach((subcat) => {
    const nestedUrl = subcategoryToNestedUrl[subcat.slug]
    if (nestedUrl) {
      nestedSubcategoryUrls.add(nestedUrl)
    }
  })

  const subcategoryPages: MetadataRoute.Sitemap = Array.from(nestedSubcategoryUrls).map((url) => ({
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
    ...industryPages,
  ]
}
