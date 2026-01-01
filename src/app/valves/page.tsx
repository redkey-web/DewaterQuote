import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Industrial Valves | Check, Gate, Ball & Butterfly Valves | Dewater Products",
  description:
    "Industrial valves including butterfly valves, duckbill check valves, gate valves, ball valves, and foot valves. 316 stainless steel and ductile iron. Australia-wide delivery.",
  openGraph: {
    title: "Industrial Valves - Dewater Products",
    description: "Industrial valves for water, process, and HVAC applications. Butterfly, gate, ball, and check valves.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/valves",
  },
}

export const revalidate = 60

export default async function ValvesPage() {
  const [valveProducts, valveSubcategories] = await Promise.all([
    getProductsByCategory("valves"),
    getSubcategoriesByCategory("valves"),
  ])

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Valves", url: "https://dewater-products.vercel.app/valves" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Industrial Valves</h1>
          <p className="text-muted-foreground">
            Industrial-grade valves for fluid control, isolation, and backflow prevention.
          </p>
        </div>

        {/* Subcategory Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Browse by Valve Type</h2>
          <div className="flex flex-wrap gap-3">
            {valveSubcategories.map((subcat, index) => (
              <Link key={subcat.slug} href={`/valves/${subcat.slug}`}>
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

        {/* All Products */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Valve Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {valveProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Valve?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you find the right valve for your application.
            Call us on 1300 271 290 or request a quote.
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
