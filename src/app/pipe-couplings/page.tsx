import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle } from "lucide-react"
import { getProductsByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pipe Couplings | Straub & Orbit Couplings Australia | Dewater Products",
  description:
    "Industrial pipe couplings for joining plain-ended pipes. Straub GRIP & FLEX, Orbit Flex Grip & Metal Lock. 316 stainless steel with EPDM seals. WRAS approved. Australia-wide delivery.",
  keywords: [
    "pipe couplings",
    "pipe couplings Australia",
    "Straub couplings",
    "Orbit couplings",
    "flexible pipe couplings",
    "restrained pipe couplings",
    "316 stainless steel couplings",
  ],
  openGraph: {
    title: "Pipe Couplings - Straub & Orbit | Dewater Products",
    description: "Flexible and restrained pipe couplings for pressure, drainage, and suction pipelines.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/pipe-couplings",
  },
}

export const revalidate = 60

const brands = [
  {
    name: "Straub",
    slug: "straub",
    description: "Swiss-engineered GRIP and FLEX couplings. Premium quality with 25+ year service life.",
    logo: "/images/brands/straub-logo.png",
  },
  {
    name: "Orbit",
    slug: "orbit",
    description: "Australian industrial couplings. Straub-compatible dimensions at competitive prices.",
    logo: "/images/brands/orbit-couplings.png",
  },
]

const couplingTypes = [
  {
    name: "Flexible Couplings",
    description: "Allow axial movement for thermal expansion and vibration absorption.",
    products: ["Straub FLEX", "Orbit Flex Grip"],
  },
  {
    name: "Restrained Couplings",
    description: "Grip teeth provide axial restraint for thrust-loaded applications.",
    products: ["Straub GRIP", "Orbit Metal Lock"],
  },
  {
    name: "Large Diameter",
    description: "Open-style couplings for pipes 300mm to 2000mm OD.",
    products: ["Straub OPEN-FLEX", "Orbit Open Flex"],
  },
]

const applications = [
  "Joining plain-ended pipes - steel, ductile iron, PVC, PE, concrete",
  "Transition connections - join different pipe materials and sizes",
  "Pipe repair - seal leaks without pipe replacement",
  "Vibration isolation - absorb pump and equipment vibration",
  "Fire protection - FM/UL approved fire-rated options",
  "Process pipelines - chemical and food-grade applications",
]

export default async function PipeCouplingsPage() {
  // Get all coupling products from database (pipe-couplings and pipe-repair-clamps categories)
  const [pipeCouplingsProducts, repairClampsProducts] = await Promise.all([
    getProductsByCategory('pipe-couplings'),
    getProductsByCategory('pipe-repair-clamps'),
  ])
  const couplingProducts = [...pipeCouplingsProducts, ...repairClampsProducts]

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Pipe Couplings", url: "https://dewater-products.vercel.app/pipe-couplings" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Minimal Hero */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Pipe Couplings</h1>
          <p className="text-muted-foreground">
            316 stainless steel couplings for joining, repair, and transition applications.
          </p>
        </div>

        {/* Shop by Brand - Compact */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brands.map((brand) => (
              <Link key={brand.slug} href={`/${brand.slug}`}>
                <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full flex items-center gap-4">
                  <div className="relative h-10 w-28 flex-shrink-0">
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <div className="flex items-center text-primary font-medium text-sm">
                    View Products
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Pipe Couplings</h2>
            <span className="text-muted-foreground">{couplingProducts.length} products</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {couplingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Coupling Types - Below Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Coupling Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {couplingTypes.map((type) => (
              <div key={type.name} className="p-6 rounded-lg bg-card border border-border">
                <h3 className="font-semibold mb-2">{type.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                <div className="flex flex-wrap gap-2">
                  {type.products.map((product) => (
                    <span key={product} className="px-2 py-1 bg-muted rounded text-xs">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

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

        {/* Related Pages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/pipe-repair">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Pipe Repair Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/flange-adaptors">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Flange Adaptors</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/rubber-expansion-joints">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Rubber Expansion Joints</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Coupling?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you choose between Straub and Orbit couplings
            for your application. Call us on 1300 271 290 or request a quote.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/request-quote"
              className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium hover:bg-accent transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
