import Link from "next/link"
import type { Metadata } from "next"
import { getProductsBySubcategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import ApplicationLinks from "@/components/ApplicationLinks"

const content = {
  title: "Gate Valves",
  metaDescription: "Gate valves and knife gate valves for full-bore shutoff. Ductile iron resilient seated, 316 stainless steel, and lever-operated knife gate valves. Australia-wide delivery.",
  heroDescription: "Full-bore isolation valves for water, wastewater, and slurry applications. Resilient seated gate valves and lever-operated knife gate valves.",
  longDescription: "We stock gate valves and knife gate valves for a wide range of applications. Gate valves provide full-bore shutoff for water distribution, while knife gate valves are designed for slurry, solids, and wastewater where a shearing action is needed.",
  features: ["Full bore design - no flow restriction", "Gate valves for clean water service", "Knife gate valves for slurry and solids", "316 stainless steel options", "Lever operated for manual control", "Metal or resilient seated options"],
  applications: ["Water distribution", "Wastewater treatment", "Mining and slurry", "Process isolation"],
}

export const metadata: Metadata = {
  title: `${content.title} | Dewater Products`,
  description: content.metaDescription,
  alternates: { canonical: "https://dewaterproducts.com.au/gate-valves" },
}

export const revalidate = 60

export default async function GateValvesPage() {
  const products = await getProductsBySubcategory("valves", "gate-valve")
  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Valves", url: "https://dewaterproducts.com.au/industrial-valves" },
    { name: content.title, url: "https://dewaterproducts.com.au/gate-valves" },
  ]

  return (
    <div className="min-h-screen bg-stone-200 dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* Dark grey strip behind header */}
      <div className="h-[44px] bg-zinc-500 -mt-[44px]" />
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
        {/* Gate vs Knife Gate */}
        <div className="mb-10 bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Gate Valves vs Knife Gate Valves</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-primary">Gate Valves (Wedge)</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Traditional gate valves use a wedge-shaped disc that lowers into the flow path.
                Best for clean water service where a tight seal is required.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Resilient seated for bubble-tight shutoff</li>
                <li>• Non-rising stem for underground install</li>
                <li>• Ductile iron or stainless steel body</li>
                <li>• Water distribution, fire protection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-primary">Knife Gate Valves</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Knife gate valves use a thin blade that slices through the media. Designed for
                slurry, solids, pulp, and wastewater where a shearing action is needed.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cuts through solids and fibrous media</li>
                <li>• Lever operated for quick manual control</li>
                <li>• 316 stainless steel construction</li>
                <li>• Metal or EPDM resilient seated</li>
              </ul>
            </div>
          </div>
        </div>

        {/* When to Use */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Choosing the Right Valve</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Use a Gate Valve when:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Clean water or liquid service</li>
                <li>• Underground or buried installations</li>
                <li>• Bubble-tight shutoff required</li>
                <li>• Water mains, fire systems, irrigation</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Use a Knife Gate Valve when:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Slurry, solids, or fibrous media</li>
                <li>• Wastewater or sewage</li>
                <li>• Frequent manual operation needed</li>
                <li>• Mining, pulp & paper, food processing</li>
              </ul>
            </div>
          </div>
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
