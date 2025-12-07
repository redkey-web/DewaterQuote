import { MetadataRoute } from "next"
import { products } from "@/data/catalog"

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
  const categoryPages: MetadataRoute.Sitemap = [
    "pipe-couplings",
    "valves",
    "rubber-expansion-joints",
    "strainers",
  ].map((category) => ({
    url: `${BASE_URL}/${category}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Product detail pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Brand pages
  const brandPages: MetadataRoute.Sitemap = ["orbit", "straub", "teekay"].map((brand) => ({
    url: `${BASE_URL}/brands/${brand}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
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

  return [...staticPages, ...categoryPages, ...productPages, ...brandPages, ...industryPages]
}
