import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getProductsBySubcategory } from "@/data/products"
import type { Subcategory } from "@/types"

interface SubcategoryTilesProps {
  categorySlug: string
  subcategories: Subcategory[]
  title?: string
  basePath?: string // e.g., "/valves" or "/rubber-expansion-joints"
  urlMap?: Record<string, string> // Map subcategory slug to flat URL, e.g., { 'single-sphere': '/single-sphere-expansion-joints' }
  hideEmpty?: boolean // Hide subcategories with 0 products
}

export default async function SubcategoryTiles({
  categorySlug,
  subcategories,
  title = "Search by Type",
  basePath,
  urlMap,
  hideEmpty = false,
}: SubcategoryTilesProps) {
  if (subcategories.length === 0) return null

  // Fetch first product for each subcategory to get images
  const subcategoriesWithImages = await Promise.all(
    subcategories.map(async (subcat) => {
      const products = await getProductsBySubcategory(categorySlug, subcat.slug)
      const firstProduct = products[0]
      const image = firstProduct?.images?.[0]?.url || "/images/placeholder-product.jpg"
      return {
        ...subcat,
        image,
        productCount: products.length,
      }
    })
  )

  // Filter out empty subcategories if hideEmpty is true
  const filteredSubcategories = hideEmpty
    ? subcategoriesWithImages.filter(s => s.productCount > 0)
    : subcategoriesWithImages

  if (filteredSubcategories.length === 0) return null

  const path = basePath || `/${categorySlug}`

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredSubcategories.map((subcat) => {
          // Use urlMap if provided, otherwise fall back to basePath/slug pattern
          const href = urlMap?.[subcat.slug] ?? `${path}/${subcat.slug}`
          return (
          <Link
            key={subcat.slug}
            href={href}
            className="group"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all">
              <Image
                src={subcat.image}
                alt={subcat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="font-semibold text-white text-sm leading-tight mb-1">
                  {subcat.name}
                </h3>
                <div className="flex items-center text-white/80 text-xs">
                  <span>{subcat.productCount} products</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        )})}
      </div>
    </div>
  )
}
