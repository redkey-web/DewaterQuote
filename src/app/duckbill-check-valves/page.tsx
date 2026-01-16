import Link from "next/link"
import type { Metadata } from "next"
import { getProductsBySubcategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Duckbill Check Valves Australia | Rubber Non-Return Valves | Dewater Products",
  description: "Duckbill check valves for stormwater outfalls, wastewater systems, and backflow prevention. Neoprene rubber construction. Zero maintenance. Australia-wide delivery.",
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
  openGraph: {
    title: "Duckbill Check Valves - Rubber Non-Return Valves | Dewater Products",
    description: "Zero-maintenance duckbill check valves for stormwater and wastewater. Neoprene rubber construction.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/duckbill-check-valves",
  },
}

export const revalidate = 60

const features = [
  "Zero maintenance - no moving parts",
  "Self-cleaning design",
  "Low headloss operation",
  "Neoprene rubber construction",
  "316 stainless steel clamps",
  "Curved bill for tighter seal",
  "Opens at 25mm head pressure",
  "Prevents backflow and odours",
]

const applications = [
  "Stormwater outfalls",
  "Wastewater discharge",
  "Pump station outlets",
  "Tide gates replacement",
  "Dam and levee outlets",
  "Marine and coastal",
  "Industrial effluent",
  "Drainage systems",
]

const faqs = [
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

export default async function DuckbillCheckValvesPage() {
  const products = await getProductsBySubcategory("valves", "duckbill-check-valve")

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Valves", url: "https://dewaterproducts.com.au/industrial-valves" },
    { name: "Duckbill Check Valves", url: "https://dewaterproducts.com.au/duckbill-check-valves" },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900 gradient-top-dark">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <BulkPricingTicker variant="teal" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/industrial-valves" className="hover:text-foreground transition-colors">Valves</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">Duckbill Check Valves</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Duckbill Check Valves</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Zero-maintenance rubber check valves for stormwater outfalls and backflow prevention.
            Self-cleaning design with no moving parts - simply install and forget.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {products.length > 0 ? "Duckbill Check Valve Products" : "Products Coming Soon"}
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-4">
                We stock Teekay duckbill check valves. Contact us for pricing and availability.
              </p>
              <Link
                href="/contact"
                className="text-primary hover:underline font-medium"
              >
                Contact Us for Duckbill Valves →
              </Link>
            </div>
          )}
        </div>

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

        {/* Features & Applications */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Applications</h2>
            <div className="flex flex-wrap gap-2">
              {applications.map((app, i) => (
                <span
                  key={i}
                  className="text-sm bg-muted px-3 py-1.5 rounded-md border"
                >
                  {app}
                </span>
              ))}
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
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
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
              href="/check-valves"
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
              href="/teekay"
              className="px-4 py-2 bg-card border rounded-md hover:bg-accent transition-colors"
            >
              Teekay Products
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting a Duckbill Valve?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team can help you specify the correct duckbill check valve for your outfall or
            drainage application. Call us on{" "}
            <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a>{" "}
            or request a quote.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Contact Us
            </Link>
            <Link
              href="/request-quote"
              className="px-6 py-3 bg-card border rounded-md font-medium hover:bg-accent"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
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
    </div>
  )
}
