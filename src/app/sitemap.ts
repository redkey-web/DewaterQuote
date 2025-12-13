import { MetadataRoute } from "next"
import { products, categories, subcategories } from "@/data/catalog"

const BASE_URL = "https://dewaterproducts.com.au"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/request-quote`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Subcategory pages
  const subcategoryPages: MetadataRoute.Sitemap = subcategories.map((subcat) => ({
    url: `${BASE_URL}/${subcat.category}/${subcat.slug}`,
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

  // Brand pages (top-level)
  const brandPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/straub`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9, // High priority - primary keyword target
    },
    {
      url: `${BASE_URL}/orbit`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/teekay`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

  // Application pages
  const applicationPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/pipe-repair`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

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

  return [...staticPages, ...categoryPages, ...subcategoryPages, ...productPages, ...brandPages, ...applicationPages, ...industryPages]
}
