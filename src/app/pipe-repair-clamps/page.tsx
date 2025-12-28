import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/catalog"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
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

export default function PipeRepairClampsPage() {
  const repairProducts = getProductsByCategory("pipe-repair-clamps")
  const repairSubcategories = getSubcategoriesByCategory("pipe-repair-clamps")

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Pipe Repair Clamps", url: "https://dewater-products.vercel.app/pipe-repair-clamps" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Pipe Repair Clamps</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Emergency and permanent pipe repair solutions. Our stainless steel repair clamps provide quick, reliable repairs for leaking or damaged pipelines without requiring pipe replacement or system shutdown.
          </p>
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {repairProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Emergency Repair Required?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our pipe repair clamps provide fast, reliable repairs without pipe removal.
            Call us on 1300 271 290 for urgent assistance or request a quote.
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
