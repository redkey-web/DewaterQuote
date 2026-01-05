import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Wrench } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pipe Repair Clamps | Emergency & Permanent Repairs | Dewater Products",
  description:
    "Pipe repair clamps in 316 stainless steel for emergency and permanent leak repairs. Orbit repair clamps. WRAS approved EPDM seals. 55mm to 300mm widths. Australia-wide delivery.",
  openGraph: {
    title: "Pipe Repair Clamps - Dewater Products",
    description: "Stainless steel pipe repair clamps for leak sealing and crack repairs.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/pipe-repair-clamps",
  },
}

export const revalidate = 60

export default async function PipeRepairClampsPage() {
  const [repairProducts, repairSubcategories] = await Promise.all([
    getProductsByCategory("pipe-repair-clamps"),
    getSubcategoriesByCategory("pipe-repair-clamps"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Pipe Repair Clamps", url: "https://dewaterproducts.com.au/pipe-repair-clamps" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section with 3 Product Images */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-transparent dark:from-slate-950/30 dark:via-slate-900/10 dark:to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
                <Wrench className="w-4 h-4" />
                Emergency & Permanent Repairs
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Pipe Repair Clamps</h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Fast, reliable pipe repair solutions in 316 stainless steel. Seal leaks and cracks without pipe replacement or system shutdown.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  View Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/request-quote"
                  className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium hover:bg-accent transition-colors"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
            {/* 3-Image Product Showcase */}
            <div className="flex-shrink-0 grid grid-cols-3 gap-4">
              <div className="relative w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44">
                <Image
                  src="/images/products/nobg/OCFG2-L_nobg.png"
                  alt="Orbit Flex Grip 2L Pipe Coupling"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44">
                <Image
                  src="/images/products/nobg/OCFG-L_nobg.png"
                  alt="Orbit Flex Grip L Pipe Coupling"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44">
                <Image
                  src="/images/products/nobg/STRAUB-PLAST_GRIP_nobg.png"
                  alt="Straub Plast Grip Coupling"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BulkPricingTicker variant="teal" />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Subcategory Links */}
        {repairSubcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse by Brand</h2>
            <div className="flex flex-wrap gap-3">
              {repairSubcategories.map((subcat, index) => (
                <Link key={subcat.slug} href={`/pipe-repair-clamps/${subcat.slug}`}>
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer"
                    data-testid={`link-subcategory-${index}`}
                  >
                    <span className="font-medium">{subcat.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/pipe-couplings">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Pipe Couplings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* All Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Pipe Repair Clamps</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {repairProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Emergency Repair Required?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our pipe repair clamps provide fast, reliable repairs without pipe removal.
            Call us on <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> for urgent assistance or request a quote.
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
