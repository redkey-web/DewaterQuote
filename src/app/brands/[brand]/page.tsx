import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { products } from "@/data/catalog"
import ProductCard from "@/components/ProductCard"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

interface BrandPageProps {
  params: Promise<{ brand: string }>
}

const brandInfo: Record<string, { name: string; description: string; logo: string }> = {
  orbit: {
    name: "Orbit",
    description:
      "Orbit manufactures high-quality pipe couplings and fittings designed for demanding industrial applications. Known for reliability and precision engineering.",
    logo: "/images/brands/orbit-couplings.png",
  },
  straub: {
    name: "Straub",
    description:
      "Straub is a global leader in pipe coupling technology, offering innovative solutions for secure and maintenance-free pipe connections across all industries.",
    logo: "/images/brands/straub-logo.png",
  },
  teekay: {
    name: "Teekay",
    description:
      "Teekay specializes in rubber expansion joints and flexible connectors, providing vibration absorption and thermal compensation solutions for piping systems.",
    logo: "/images/brands/teekay-logo.png",
  },
}

const categoryNames: Record<string, string> = {
  valves: "Valves",
  "pipe-couplings": "Pipe Couplings",
  "rubber-expansion-joints": "Expansion Joints",
  strainers: "Strainers",
  "pipe-repair": "Repair Clamps",
  "flange-adaptors": "Flange Adaptors",
}

export function generateStaticParams() {
  return Object.keys(brandInfo).map((brand) => ({
    brand,
  }))
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand: brandSlug } = await params
  const brand = brandInfo[brandSlug.toLowerCase()]
  if (!brand) return { title: "Brand Not Found" }

  return {
    title: `${brand.name} Products - Industrial Pipe Fittings & Valves`,
    description: `${brand.description} Browse ${brand.name} pipe couplings, valves, and industrial fittings from Dewater Products Australia.`,
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand: brandSlug } = await params
  const brandKey = brandSlug.toLowerCase()
  const brand = brandInfo[brandKey]

  if (!brand) {
    notFound()
  }

  const brandProducts = products.filter(
    (p) => p.brand.toLowerCase().includes(brand.name.toLowerCase())
  )

  const productsByCategory = brandProducts.reduce((acc, product) => {
    const category = product.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {} as Record<string, typeof products>)

  const categories = Object.keys(productsByCategory)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link
          href="/brands"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          All Brands
        </Link>

        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
          <div className="h-16 flex items-center">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={160}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{brand.name} Products</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{brand.description}</p>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-12">
            {categories.map((category) => (
              <section key={category}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {categoryNames[category] || category}
                  </h2>
                  <Link
                    href={`/${category}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View all {categoryNames[category] || category}
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productsByCategory[category].map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
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
