import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Droplets } from "lucide-react"
import { getProductsByBrand } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dewater Products | Own Brand Industrial Pipe Fittings | Dewater Products Australia",
  description:
    "Dewater Products own-brand industrial pipe fittings, valves, and accessories. Quality products at competitive prices. Australia-wide delivery.",
  openGraph: {
    title: "Dewater Products - Own Brand Industrial Pipe Fittings",
    description: "Quality own-brand industrial pipe fittings and accessories.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/dewater-products",
  },
}

export const revalidate = 60

export default async function DewaterProductsPage() {
  const products = await getProductsByBrand("dewater-products")

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Dewater Products", url: "https://dewaterproducts.com.au/dewater-products" },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BulkPricingTicker variant="teal" />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b -mt-[88px] pt-[88px]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#39C5DA] via-[#2BB5C9] to-slate-400" />
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl animate-blob"
            style={{ backgroundColor: '#ffffff' }}
          />
          <div
            className="absolute top-20 -right-32 w-[450px] h-[450px] rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#0f172a' }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                <Droplets className="w-4 h-4" />
                Own Brand Products
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Dewater Products
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Quality industrial pipe fittings and accessories under our own brand.
                Competitive prices without compromising on quality.
              </p>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
                <Image
                  src="/images/dewater-logo.png"
                  alt="Dewater Products"
                  width={200}
                  height={200}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        {/* Products Section */}
        <div id="products" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Dewater Products Range</h2>
            <span className="text-muted-foreground">{products.length} products</span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-muted-foreground mb-4">
                Products coming soon. Contact us for more information.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium"
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>

        {/* Related Pages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/pipe-couplings">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Pipe Couplings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/industrial-valves">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Industrial Valves</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href="/strainers">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Strainers</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Questions About Our Products?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team can help you find the right products for your application.
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
