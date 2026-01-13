import Link from "next/link"
import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import ProductCard from "@/components/ProductCard"
import { getProductBySlug } from "@/data/products"
import { ArrowRight, Phone } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Muff Couplings Australia | Sleeve Pipe Couplings | Dewater Products",
  description: "Muff couplings (sleeve couplings) for joining plain-ended pipes. Full-bore design for unrestricted flow. Steel and stainless steel options. Contact us for pricing.",
  keywords: [
    "muff couplings",
    "muff coupling",
    "sleeve coupling",
    "sleeve couplings",
    "full coupling",
    "pipe sleeve",
    "pipe coupling Australia",
    "plain end pipe coupling",
  ],
  openGraph: {
    title: "Muff Couplings - Sleeve Pipe Couplings | Dewater Products",
    description: "Full-bore muff couplings for joining plain-ended pipes. Contact us for pricing and availability.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/muff-couplings",
  },
}

const features = [
  "Full-bore design - no flow restriction",
  "Joins plain-ended pipes",
  "Steel or stainless steel construction",
  "Simple bolt-together installation",
  "No welding required",
  "Allows for pipe misalignment",
  "Various pressure ratings available",
  "Standard flange drilling patterns",
]

const applications = [
  "Pipeline construction",
  "Pipe repair and maintenance",
  "Connecting dissimilar pipe materials",
  "Pump and valve connections",
  "Process piping systems",
  "Water and wastewater",
  "Mining and industrial",
  "Marine and offshore",
]

const faqs = [
  {
    question: "What is a muff coupling?",
    answer:
      "A muff coupling (also known as a sleeve coupling or full coupling) is a pipe fitting used to join two plain-ended pipes together. It consists of a sleeve that fits over the pipe ends with rubber seals and bolted clamps to create a pressure-tight connection without welding or threading.",
  },
  {
    question: "What is the difference between a muff coupling and a flange adaptor?",
    answer:
      "A muff coupling joins two plain-ended pipes together (pipe to pipe), while a flange adaptor connects a plain-ended pipe to a flanged valve or fitting. Muff couplings are typically used for straight pipeline connections, whereas flange adaptors are used at equipment terminations.",
  },
  {
    question: "What sizes are muff couplings available in?",
    answer:
      "Muff couplings are available in a wide range of sizes to suit most pipe diameters. Contact us with your specific pipe outside diameter and we can advise on availability and pricing.",
  },
  {
    question: "Can muff couplings join different pipe materials?",
    answer:
      "Yes, muff couplings can join pipes of different materials such as steel to ductile iron, or PVC to steel. The coupling accommodates different pipe ODs and provides a sealed connection regardless of pipe material.",
  },
  {
    question: "Are muff couplings suitable for buried applications?",
    answer:
      "Yes, muff couplings with appropriate corrosion protection (epoxy coating or stainless steel) are suitable for buried pipeline applications. They provide a flexible joint that can accommodate ground movement.",
  },
]

export const revalidate = 60

export default async function MuffCouplingsPage() {
  // Fetch the muff coupling product
  const muffCoupling = await getProductBySlug('muff-couplings-aluminium-table-de')

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Pipe Couplings", url: "https://dewaterproducts.com.au/pipe-couplings" },
    { name: "Muff Couplings", url: "https://dewaterproducts.com.au/muff-couplings" },
  ]

  return (
    <div className="min-h-screen bg-stone-200 dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* Dark grey strip behind header */}
      <div className="h-[44px] bg-zinc-500 -mt-[44px]" />
      <BulkPricingTicker variant="teal" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/pipe-couplings" className="hover:text-foreground transition-colors">Pipe Couplings</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">Muff Couplings</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Muff Couplings</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Full-bore sleeve couplings for joining plain-ended pipes. Simple installation
            with no welding required - bolt together for a pressure-tight seal.
          </p>
        </div>

        {/* Product */}
        {muffCoupling && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Our Muff Coupling</h2>
            <div className="max-w-sm">
              <ProductCard product={muffCoupling} />
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mb-12 bg-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Need a Different Size?</h2>
              <p className="text-muted-foreground mb-4">
                Muff couplings are available in various sizes. Contact us with your pipe OD and we&apos;ll provide pricing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-medium"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <a
                  href="tel:1300271290"
                  className="inline-flex items-center px-5 py-2.5 bg-card border border-border rounded-md font-medium"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  1300 271 290
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* What is a Muff Coupling */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What is a Muff Coupling?</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              A muff coupling (also called a sleeve coupling or full coupling) is a mechanical pipe
              fitting used to join two plain-ended pipes together. Unlike traditional flanged connections
              that require welded or screwed flanges on each pipe, muff couplings slip over the pipe
              ends and use rubber gaskets with bolt-together clamps to create a leak-proof seal.
            </p>
            <p className="mt-4">
              The key advantage of muff couplings is their ability to join pipes quickly without
              hot work (welding). This makes them ideal for repairs, modifications, and new installations
              where welding is impractical or prohibited. The full-bore design means there is no
              restriction to flow through the coupling.
            </p>
          </div>
        </div>

        {/* How Muff Couplings Work */}
        <div className="mb-12 bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How Muff Couplings Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1</div>
              <h3 className="font-semibold mb-2">Prepare Pipes</h3>
              <p className="text-sm text-muted-foreground">
                Clean the pipe ends and ensure they are free from burrs, scale, and debris.
                Pipes should be plain-ended (no threads or flanges required).
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2</div>
              <h3 className="font-semibold mb-2">Position Coupling</h3>
              <p className="text-sm text-muted-foreground">
                Slide the coupling sleeve over one pipe end, bring the pipes together,
                then slide the coupling back to centre over the joint.
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <h3 className="font-semibold mb-2">Tighten Bolts</h3>
              <p className="text-sm text-muted-foreground">
                Tighten the bolts evenly around the coupling to compress the rubber seals
                against the pipe surfaces, creating a watertight connection.
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

        {/* Types of Muff Couplings */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Types of Muff Couplings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Standard Muff Coupling</h3>
              <p className="text-sm text-muted-foreground">
                For joining pipes of the same outside diameter. Available in carbon steel,
                ductile iron, and stainless steel. Standard pressure ratings from PN10 to PN25.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Stepped Muff Coupling</h3>
              <p className="text-sm text-muted-foreground">
                For joining pipes of different outside diameters. Useful when connecting
                existing pipework of different sizes or materials.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Wide-Range Muff Coupling</h3>
              <p className="text-sm text-muted-foreground">
                Accommodates a range of pipe ODs within a single coupling size. Ideal when
                exact pipe dimensions are unknown or vary across the installation.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Restrained Muff Coupling</h3>
              <p className="text-sm text-muted-foreground">
                Includes axial restraint to prevent pipe pull-out under thrust loads.
                Required where pipes are subject to internal pressure thrust forces.
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

        {/* Related Products */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Related Products</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pipe-couplings"
              className="px-4 py-2 bg-card border rounded-md hover:bg-accent transition-colors"
            >
              All Pipe Couplings
            </Link>
            <Link
              href="/flange-adaptors"
              className="px-4 py-2 bg-card border rounded-md hover:bg-accent transition-colors"
            >
              Flange Adaptors
            </Link>
            <Link
              href="/orbit-couplings"
              className="px-4 py-2 bg-card border rounded-md hover:bg-accent transition-colors"
            >
              Orbit Couplings
            </Link>
            <Link
              href="/straub-couplings"
              className="px-4 py-2 bg-card border rounded-md hover:bg-accent transition-colors"
            >
              Straub Couplings
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need a Muff Coupling Quote?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tell us your pipe size (outside diameter) and material, and we&apos;ll provide
            pricing and lead time. Call us on{" "}
            <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a>{" "}
            or request a quote online.
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
