import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getProductsBySubcategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import ApplicationLinks from "@/components/ApplicationLinks"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Subcategory slug → database subcategory slug mapping
const subcategoryDbMap: Record<string, string> = {
  "butterfly-valves": "butterfly-valve",
  "check-valves": "check-valves",
  "ball-valves": "ball-valve",
  "gate-valves": "gate-valve",
  "foot-valves": "foot-valve",
  "float-valves": "float-valve",
  "duckbill-valves": "duckbill-check-valve",
}

// SEO content for valve subcategories
const subcategoryContent: Record<string, {
  title: string
  metaDescription: string
  heroDescription: string
  longDescription: string
  features: string[]
  applications: string[]
  keywords?: string[]
  extraContent?: "check-valves" | "gate-valves" | "duckbill-valves"
}> = {
  "butterfly-valves": {
    title: "Butterfly Valves",
    metaDescription: "Industrial butterfly valves in 316 stainless steel and ductile iron. Wafer and lug designs. PN16 rated. Australia-wide delivery.",
    heroDescription: "Quarter-turn valves with a rotating disc for efficient flow control. Compact design ideal for large diameter pipes.",
    longDescription: "Butterfly valves provide cost-effective flow control for water, air, and gas applications. The rotating disc design offers quick operation with minimal pressure drop.",
    features: ["Quarter-turn operation", "Compact wafer design", "316SS or ductile iron", "PTFE/EPDM seat options", "Lever or gear operated", "PN16 rated"],
    applications: ["Water treatment", "HVAC systems", "Process industries", "Fire protection"],
  },
  "check-valves": {
    title: "Check Valves",
    metaDescription: "Swing check valves and ball check valves for backflow prevention. Stainless steel, ductile iron, and cast iron options. Australia-wide delivery.",
    heroDescription: "Non-return valves that prevent reverse flow. Swing check and ball check valves in various materials and flange standards.",
    longDescription: "Check valves prevent backflow in piping systems by allowing flow in one direction only. We stock swing check valves (with a hinged disc) and ball check valves (using a floating ball) in stainless steel, ductile iron, and cast iron.",
    features: ["Swing check valves - hinged disc design", "Ball check valves - floating ball seals on backflow", "Stainless steel 316 options", "Cast iron with FBE coating", "Table E and ANSI flange options", "WRAS approved seals available"],
    applications: ["Pump discharge lines", "Water distribution", "Process pipelines", "Backflow prevention"],
    extraContent: "check-valves",
  },
  "ball-valves": {
    title: "Ball Valves",
    metaDescription: "316 stainless steel ball valves. Full bore, flanged and threaded options. Fire-safe design. PN40 rated.",
    heroDescription: "Quarter-turn shut-off valves with rotating ball for precise flow control. Full bore design minimises pressure drop.",
    longDescription: "Ball valves offer reliable on/off control with quick quarter-turn operation. Our 316 stainless steel range includes full-bore designs and fire-safe certification.",
    features: ["Full bore design", "316 stainless steel", "PTFE seats and seals", "Fire-safe certified", "Lockable lever", "PN40 rated"],
    applications: ["Chemical plants", "Process industries", "Oil and gas", "Water treatment"],
  },
  "gate-valves": {
    title: "Gate Valves",
    metaDescription: "Gate valves and knife gate valves for full-bore shutoff. Ductile iron resilient seated, 316 stainless steel, and lever-operated knife gate valves. Australia-wide delivery.",
    heroDescription: "Full-bore isolation valves for water, wastewater, and slurry applications. Resilient seated gate valves and lever-operated knife gate valves.",
    longDescription: "We stock gate valves and knife gate valves for a wide range of applications. Gate valves provide full-bore shutoff for water distribution, while knife gate valves are designed for slurry, solids, and wastewater where a shearing action is needed.",
    features: ["Full bore design - no flow restriction", "Gate valves for clean water service", "Knife gate valves for slurry and solids", "316 stainless steel options", "Lever operated for manual control", "Metal or resilient seated options"],
    applications: ["Water distribution", "Wastewater treatment", "Mining and slurry", "Process isolation"],
    extraContent: "gate-valves",
  },
  "foot-valves": {
    title: "Foot Valves",
    metaDescription: "Foot valves with integrated strainers for pump suction lines. Galvanised and stainless steel. Maintains pump prime.",
    heroDescription: "Suction line check valves with integrated strainers. Prevents backflow and keeps pumps primed for reliable operation.",
    longDescription: "Foot valves are installed at the bottom of pump suction lines to maintain prime and prevent backflow when the pump stops. Integrated strainer protects the pump from debris.",
    features: ["Integrated strainer", "Maintains pump prime", "Prevents backflow", "Table D flanged", "EPDM seals", "Galvanised or SS"],
    applications: ["Pump suction lines", "Irrigation systems", "Water supply", "Agricultural pumping"],
  },
  "float-valves": {
    title: "Float Valves",
    metaDescription: "Float valves for automatic liquid level control in tanks and reservoirs. Brass, bronze, and stainless steel construction.",
    heroDescription: "Level control valves that maintain liquid levels in tanks and reservoirs. Automatic shut-off prevents overflow.",
    longDescription: "Float valves automatically control liquid levels in tanks, reservoirs, and troughs. When level drops, valve opens to refill. As level rises, float closes valve to prevent overflow.",
    features: ["Automatic level control", "Prevents overflow", "No power required", "Brass/bronze/stainless", "Heavy-duty options", "Various float sizes"],
    applications: ["Water tanks", "Livestock troughs", "Cooling towers", "Storage reservoirs"],
  },
  "duckbill-valves": {
    title: "Duckbill Check Valves",
    metaDescription: "Duckbill check valves for stormwater outfalls, wastewater systems, and backflow prevention. Neoprene rubber construction. Zero maintenance. Australia-wide delivery.",
    heroDescription: "Zero-maintenance rubber check valves for stormwater outfalls and backflow prevention. Self-cleaning design with no moving parts - simply install and forget.",
    longDescription: "Duckbill check valves are flexible rubber valves with a duck-bill shaped opening. When forward pressure is applied, the bill opens to allow flow. When flow stops or reverses, the bill closes to prevent backflow. They have no moving mechanical parts, making them maintenance-free.",
    features: [
      "Zero maintenance - no moving parts",
      "Self-cleaning design",
      "Low headloss operation",
      "Neoprene rubber construction",
      "316 stainless steel clamps",
      "Curved bill for tighter seal",
      "Opens at 25mm head pressure",
      "Prevents backflow and odours",
    ],
    applications: ["Stormwater outfalls", "Wastewater discharge", "Pump station outlets", "Tide gates replacement", "Dam and levee outlets", "Marine and coastal", "Industrial effluent", "Drainage systems"],
    keywords: [
      "duckbill check valve",
      "duckbill valve",
      "rubber check valve",
      "stormwater check valve",
      "outfall valve",
      "non-return valve",
      "backflow prevention valve",
      "neoprene check valve",
      "slip-on check valve",
      "Teekay duckbill",
    ],
    extraContent: "duckbill-valves",
  },
}

// FAQ content for duckbill valves
const duckbillFaqs = [
  {
    question: "What is a duckbill check valve?",
    answer:
      "A duckbill check valve is a flexible rubber valve with a duck-bill shaped opening. When forward pressure is applied, the bill opens to allow flow. When flow stops or reverses, the bill closes to prevent backflow. They have no moving mechanical parts, making them maintenance-free.",
  },
  {
    question: "How does a duckbill valve differ from a flap valve?",
    answer:
      "Unlike flap gates which use a hinged metal plate, duckbill valves use flexible rubber that opens and closes with flow changes. Duckbill valves are self-cleaning, have lower headloss, require no maintenance, and provide a positive seal even with debris present.",
  },
  {
    question: "What sizes are duckbill check valves available in?",
    answer:
      "Our duckbill check valves are available in sizes from 88.9mm to 1016mm outside diameter. The slip-on design fits directly over the end of plain-ended pipes. Contact us for specific size requirements.",
  },
  {
    question: "What materials are duckbill valves made from?",
    answer:
      "The valve body is made from reinforced neoprene rubber for durability and chemical resistance. The clamping band is 316 stainless steel for corrosion resistance in marine and harsh environments.",
  },
  {
    question: "Where are duckbill check valves typically used?",
    answer:
      "Duckbill valves are ideal for stormwater outfalls, wastewater discharge points, pump station outlets, and anywhere backflow prevention is needed. They're particularly popular for tide gates, dam outlets, and coastal applications.",
  },
]

interface SubcategoryPageProps {
  params: Promise<{
    subcategory: string
  }>
}

// Generate static params for valve subcategories
export async function generateStaticParams() {
  return Object.keys(subcategoryContent).map((slug) => ({
    subcategory: slug,
  }))
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { subcategory } = await params
  const content = subcategoryContent[subcategory]

  if (!content) {
    return { title: "Not Found" }
  }

  const metadata: Metadata = {
    title: content.extraContent === "duckbill-valves"
      ? "Duckbill Check Valves Australia | Rubber Non-Return Valves | Dewater Products"
      : `${content.title} | Dewater Products`,
    description: content.metaDescription,
    openGraph: {
      title: `${content.title} - Dewater Products`,
      description: content.metaDescription,
      type: "website",
      url: `https://dewaterproducts.com.au/industrial-valves/${subcategory}`,
    },
    alternates: {
      canonical: `https://dewaterproducts.com.au/industrial-valves/${subcategory}`,
    },
  }

  if (content.keywords) {
    metadata.keywords = content.keywords
  }

  return metadata
}

export const revalidate = 60
export const dynamic = "force-dynamic"

export default async function ValveSubcategoryPage({ params }: SubcategoryPageProps) {
  const { subcategory } = await params
  const content = subcategoryContent[subcategory]

  if (!content) {
    notFound()
  }

  const dbSubcategory = subcategoryDbMap[subcategory] || subcategory
  const products = await getProductsBySubcategory("valves", dbSubcategory)

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Industrial Valves", url: "https://dewaterproducts.com.au/industrial-valves" },
    { name: content.title, url: `https://dewaterproducts.com.au/industrial-valves/${subcategory}` },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900 gradient-top-dark">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BulkPricingTicker variant="teal" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/industrial-valves" className="hover:text-foreground transition-colors">Valves</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">{content.title}</span>
        </nav>

        {/* Hero */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-muted-foreground">{content.heroDescription}</p>
        </div>

        {/* Products Grid */}
        <div className="mb-10">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">We&apos;re currently adding products.</p>
              <Link href="/industrial-valves" className="text-primary hover:underline font-medium">View all Valves →</Link>
            </div>
          )}
        </div>

        {/* About Section */}
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
              {content.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Extra Content for Check Valves */}
        {content.extraContent === "check-valves" && (
          <>
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

            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-3">Looking for Duckbill Check Valves?</h3>
              <p className="text-muted-foreground mb-4">
                For stormwater outfalls and drainage applications, see our zero-maintenance rubber duckbill valves.
              </p>
              <Link
                href="/industrial-valves/duckbill-valves"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
              >
                View Duckbill Check Valves →
              </Link>
            </div>
          </>
        )}

        {/* Extra Content for Gate Valves */}
        {content.extraContent === "gate-valves" && (
          <>
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
          </>
        )}

        {/* Extra Content for Duckbill Valves */}
        {content.extraContent === "duckbill-valves" && (
          <>
            {/* How Duckbill Valves Work */}
            <div className="mb-12 bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">How Duckbill Check Valves Work</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Forward Flow</h3>
                  <p className="text-muted-foreground">
                    When water flows in the intended direction, the flexible rubber &quot;bill&quot; opens under
                    minimal pressure (as low as 25mm head). The curved design provides maximum flow area
                    with minimal headloss.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Backflow Prevention</h3>
                  <p className="text-muted-foreground">
                    When flow stops or reverses (such as during high tide or backwater conditions),
                    the rubber bill closes and seals. The curved bill design provides 50% more sealing
                    area than straight-bill designs.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Choose Duckbill */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Why Choose Duckbill Over Flap Gates?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Zero Maintenance</h3>
                  <p className="text-sm text-muted-foreground">
                    No hinges, no pins, no seals to replace. Duckbill valves have no mechanical parts that can corrode, jam, or wear out.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Self-Cleaning</h3>
                  <p className="text-sm text-muted-foreground">
                    The flexible rubber bill clears debris with each flow cycle. No accumulation of sediment or rubbish like flap gates.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Positive Seal</h3>
                  <p className="text-sm text-muted-foreground">
                    Rubber-to-rubber seal provides watertight closure even with debris present. No metal-to-metal contact issues.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-3">
                {duckbillFaqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={'item-${index}'}
                    className="bg-card border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Related Links */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Related Products</h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/industrial-valves/check-valves"
                  className="px-4 py-2 bg-card border rounded-md hover:bg-accent transition-colors"
                >
                  All Check Valves
                </Link>
                <Link
                  href="/industrial-valves"
                  className="px-4 py-2 bg-card border rounded-md hover:bg-accent transition-colors"
                >
                  All Valves
                </Link>
                <Link
                  href="/pipe-couplings/teekay"
                  className="px-4 py-2 bg-card border rounded-md hover:bg-accent transition-colors"
                >
                  Teekay Products
                </Link>
              </div>
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Valve?</h2>
          <p className="text-muted-foreground mb-6">
            Call <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">
              Contact Us
            </Link>
            <Link href="/request-quote" className="px-6 py-3 bg-card border rounded-md font-medium hover:bg-accent">
              Request Quote
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Schema for Duckbill */}
      {content.extraContent === "duckbill-valves" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: duckbillFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}
    </div>
  )
}
