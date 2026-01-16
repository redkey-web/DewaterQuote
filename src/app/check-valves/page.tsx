import Link from "next/link"
import type { Metadata } from "next"
import { getProductsBySubcategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import ApplicationLinks from "@/components/ApplicationLinks"

const content = {
  title: "Check Valves",
  metaDescription: "Swing check valves and ball check valves for backflow prevention. Stainless steel, ductile iron, and cast iron options. Australia-wide delivery.",
  heroDescription: "Non-return valves that prevent reverse flow. Swing check and ball check valves in various materials and flange standards.",
  longDescription: "Check valves prevent backflow in piping systems by allowing flow in one direction only. We stock swing check valves (with a hinged disc) and ball check valves (using a floating ball) in stainless steel, ductile iron, and cast iron.",
  features: ["Swing check valves - hinged disc design", "Ball check valves - floating ball seals on backflow", "Stainless steel 316 options", "Cast iron with FBE coating", "Table E and ANSI flange options", "WRAS approved seals available"],
  applications: ["Pump discharge lines", "Water distribution", "Process pipelines", "Backflow prevention"],
}

export const metadata: Metadata = {
  title: `${content.title} | Dewater Products`,
  description: content.metaDescription,
  alternates: { canonical: "https://dewaterproducts.com.au/check-valves" },
}

export const revalidate = 60

export default async function CheckValvesPage() {
  const products = await getProductsBySubcategory("valves", "check-valves")
  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Valves", url: "https://dewaterproducts.com.au/industrial-valves" },
    { name: content.title, url: "https://dewaterproducts.com.au/check-valves" },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900 gradient-top-dark">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BulkPricingTicker variant="teal" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/industrial-valves" className="hover:text-foreground transition-colors">Valves</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">{content.title}</span>
        </nav>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-muted-foreground">{content.heroDescription}</p>
        </div>
        <div className="mb-10">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">We&apos;re currently adding products.</p>
              <Link href="/industrial-valves" className="text-primary hover:underline font-medium">View all Valves →</Link>
            </div>
          )}
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">About {content.title}</h2>
          <p className="text-muted-foreground mb-6">{content.longDescription}</p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Applications</h3>
            <ApplicationLinks applications={content.applications} />
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {content.features.map((f, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary">✓</span><span className="text-muted-foreground">{f}</span></li>)}
            </ul>
          </div>
        </div>
        {/* Swing vs Ball Check */}
        <div className="mb-10 bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Swing Check vs Ball Check Valves</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-primary">Swing Check Valves</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Use a hinged disc that swings open with forward flow and closes under reverse flow or gravity.
                Best for horizontal lines or where low pressure drop is important.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Lower pressure drop than ball check</li>
                <li>• Suitable for larger pipe sizes</li>
                <li>• Resilient seated for bubble-tight seal</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-primary">Ball Check Valves</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Use a ball that lifts off the seat under forward flow and drops back to seal on reverse flow.
                Simple design with no moving parts to wear.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Simple, reliable operation</li>
                <li>• Works in any orientation</li>
                <li>• Good for slurry and wastewater</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related - Duckbill */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-3">Looking for Duckbill Check Valves?</h3>
          <p className="text-muted-foreground mb-4">
            For stormwater outfalls and drainage applications, see our zero-maintenance rubber duckbill valves.
          </p>
          <Link
            href="/duckbill-check-valves"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
          >
            View Duckbill Check Valves →
          </Link>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help?</h2>
          <p className="text-muted-foreground mb-6">Call <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">Contact Us</Link>
            <Link href="/request-quote" className="px-6 py-3 bg-card border rounded-md font-medium hover:bg-accent">Request Quote</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
