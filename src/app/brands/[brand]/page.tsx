import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getProductsByBrand } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

interface BrandPageProps {
  params: Promise<{ brand: string }>
}

export const revalidate = 60

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
  "defender-valves": {
    name: "Defender Valves",
    description:
      "Defender Valves specializes in high-performance industrial butterfly valves with PTFE lining, offering superior chemical resistance and reliable flow control for demanding applications.",
    logo: "/images/brands/defender-valves-logo.png",
  },
  "bore-flex-rubber": {
    name: "Bore-Flex Rubber",
    description:
      "Bore-Flex Rubber manufactures high-quality rubber expansion joints and flexible pipe connectors for vibration isolation, thermal expansion compensation, and noise reduction in piping systems.",
    logo: "/images/brands/bore-flex-rubber-logo.png",
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

  // Get products by brand from database
  const brandProducts = await getProductsByBrand(brandKey)

  const productsByCategory = brandProducts.reduce((acc, product) => {
    const category = product.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {} as Record<string, typeof brandProducts>)

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
          <div className="h-20 flex items-center">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={brandKey === "bore-flex-rubber" ? 1440 : brandKey === "orbit" ? 270 : 160}
              height={brandKey === "bore-flex-rubber" ? 540 : brandKey === "orbit" ? 90 : 60}
              className={brandKey === "bore-flex-rubber" ? "h-[144px] w-auto object-contain" : brandKey === "orbit" ? "h-[72px] w-auto object-contain" : "h-12 w-auto object-contain"}
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
