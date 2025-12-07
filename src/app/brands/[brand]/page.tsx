import { notFound } from "next/navigation"
import { products } from "@/data/catalog"
import ProductCard from "@/components/ProductCard"
import type { Metadata } from "next"

interface BrandPageProps {
  params: { brand: string }
}

const brandInfo: Record<string, { name: string; description: string }> = {
  orbit: {
    name: "Orbit",
    description:
      "Orbit manufactures high-quality pipe couplings and fittings designed for demanding industrial applications. Known for reliability and precision engineering.",
  },
  straub: {
    name: "Straub",
    description:
      "Straub is a global leader in pipe coupling technology, offering innovative solutions for secure and maintenance-free pipe connections across all industries.",
  },
  teekay: {
    name: "Teekay",
    description:
      "Teekay specializes in rubber expansion joints and flexible connectors, providing vibration absorption and thermal compensation solutions for piping systems.",
  },
}

export function generateStaticParams() {
  return Object.keys(brandInfo).map((brand) => ({
    brand,
  }))
}

export function generateMetadata({ params }: BrandPageProps): Metadata {
  const brand = brandInfo[params.brand.toLowerCase()]
  if (!brand) return { title: "Brand Not Found" }

  return {
    title: `${brand.name} Products - Industrial Pipe Fittings & Valves`,
    description: `${brand.description} Browse ${brand.name} pipe couplings, valves, and industrial fittings from Dewater Products Australia.`,
  }
}

export default function BrandPage({ params }: BrandPageProps) {
  const brandKey = params.brand.toLowerCase()
  const brand = brandInfo[brandKey]

  if (!brand) {
    notFound()
  }

  // Filter products by brand (case-insensitive, partial match)
  const brandProducts = products.filter(
    (p) => p.brand.toLowerCase().includes(brand.name.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{brand.name}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{brand.description}</p>
        </div>

        <h2 className="text-2xl font-bold mb-6">{brand.name} Products</h2>
        {brandProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brandProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No products currently available for this brand. Please contact us for more information.
          </p>
        )}
      </div>
    </div>
  )
}
