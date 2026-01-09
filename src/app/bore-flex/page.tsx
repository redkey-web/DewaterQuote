import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ArrowRight, Award } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import SubcategoryTiles from "@/components/SubcategoryTiles"
import type { Metadata } from "next"

const features = [
  "Size range from DN25 to DN3500",
  "Materials: EPDM, Neoprene, NBR, Viton, Hypalon, natural rubber",
  "Pressure ratings up to 25 BAR",
  "Vacuum ratings to 750 mm Hg",
  "Optional PTFE linings, vacuum rings, and control rods",
  "Flange options: zinc plated, galvanised, 304/316 stainless steel, epoxy-coated",
]

const applications = [
  "Pump vibration isolation",
  "HVAC systems",
  "Marine and shipboard piping",
  "Chemical processing",
  "Slurry pipelines",
  "Mining and dredging",
  "Water treatment plants",
]

export const metadata: Metadata = {
  title: "Bore-Flex Rubber Expansion Joints | Single, Twin, Arch & Reducing | Dewater Products",
  description:
    "Bore-Flex rubber expansion joints for thermal expansion, vibration absorption, and pipe misalignment. Single sphere, twin sphere, arch and reducing types. EPDM rubber with zinc or 316SS flanges. PN16 rated. Australia-wide delivery.",
  openGraph: {
    title: "Bore-Flex Rubber Expansion Joints - Dewater Products",
    description: "Bore-Flex flexible rubber joints for pumps, HVAC, and industrial piping systems.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/bore-flex",
  },
}

export const revalidate = 60

export default async function BoreFlexPage() {
  const [allProducts, expansionSubcategories] = await Promise.all([
    getProductsByCategory("rubber-expansion-joints"),
    getSubcategoriesByCategory("rubber-expansion-joints"),
  ])

  // Reorder products: triple arch and quadruple arch at positions 3 & 4
  const tripleArchProduct = allProducts.find(p => p.name.toLowerCase().includes('triple arch'))
  const quadrupleArchProduct = allProducts.find(p => p.name.toLowerCase().includes('quadruple arch'))
  const otherProducts = allProducts.filter(p =>
    !p.name.toLowerCase().includes('triple arch') &&
    !p.name.toLowerCase().includes('quadruple arch')
  )

  const expansionProducts = tripleArchProduct && quadrupleArchProduct
    ? [
        otherProducts[0],
        otherProducts[1],
        tripleArchProduct,
        quadrupleArchProduct,
        ...otherProducts.slice(2),
      ]
    : allProducts

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Bore-Flex Expansion Joints", url: "https://dewaterproducts.com.au/bore-flex" },
  ]

  return (
    <div className="min-h-screen bg-stone-200 dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        {/* Animated blob background - Red theme, confined to hero */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700" />
          {/* Blob 1 - Deep red (large, top-left) */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-35 blur-3xl animate-blob"
            style={{ backgroundColor: '#dc2626' }}
          />
          {/* Blob 2 - Bright red accent (right side) */}
          <div
            className="absolute top-20 -right-32 w-[450px] h-[450px] rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#ef4444' }}
          />
          {/* Blob 3 - Light red (bottom, adds depth) */}
          <div
            className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-full opacity-25 blur-3xl animate-blob animation-delay-4000"
            style={{ backgroundColor: '#f87171' }}
          />
          {/* Blob 4 - White glow (center-left) */}
          <div
            className="absolute top-0 left-0 w-[700px] h-[500px] rounded-full opacity-25 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <Image
                src="/images/brands/bore-flex-rubber-logo.png"
                alt="Bore-Flex Rubber"
                width={200}
                height={67}
                className="w-48 h-auto mb-6"
                priority
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Premium Rubber Expansion Joints
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Bore-Flex Expansion Joints
              </h1>
              <p className="text-xl text-gray-100 mb-6 max-w-2xl">
                Designed to reduce pipeline stress, absorb vibration, and compensate for thermal movement.
                Available in EPDM, Neoprene, NBR, Viton, and Hypalon with multiple flange options.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors shadow-lg"
                >
                  View Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center px-6 py-3 bg-white border-2 border-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-sm"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/TAREJ/TAREJ_1.png"
                  alt="Bore-Flex Triple Arch Expansion Joint"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* All Products */}
        <div id="products" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">All Bore-Flex Expansion Joints</h2>
            <span className="text-muted-foreground">{expansionProducts.length} products</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {expansionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Key Features - Critical Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search by Type - Subcategory Tiles */}
        <SubcategoryTiles
          categorySlug="rubber-expansion-joints"
          subcategories={expansionSubcategories}
          title="Search by Type"
          hideEmpty={true}
          urlMap={{
            'single-sphere': '/single-sphere-expansion-joints',
            'twin-sphere': '/twin-sphere-expansion-joints',
            'single-arch': '/single-arch-expansion-joints',
            'double-arch': '/double-arch-expansion-joints',
            'triple-arch': '/triple-arch-expansion-joints',
            'quadruple-arch': '/quadruple-arch-expansion-joints',
            'reducing': '/reducing-expansion-joints',
            'ptfe-lined': '/ptfe-lined-expansion-joints',
            'fsf-single-sphere': '/fsf-single-sphere-expansion-joints',
            'fsf-b-single-sphere': '/fsf-b-single-sphere-expansion-joints',
          }}
        />

        {/* Applications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Expansion Joint?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you specify the right expansion joint for your application, including custom flanges and movement requirements.
            Call us on <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
            >
              Contact Us
            </Link>
            <Link
              href="/request-quote"
              className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
