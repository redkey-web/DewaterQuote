import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle } from "lucide-react"
import { getProductsByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import USPBar from "@/components/USPBar"
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

// Straub coupling models
const straubCouplings = [
  { model: "Metal Grip", sizeRange: "30.0 – 609.6mm", pressure: "67 – 5 Bar", notes: "Axially restrained steel coupling" },
  { model: "Grip L", sizeRange: "26.9 – 609.6mm", pressure: "46 – 1 Bar", notes: "Restraint for wider OD range" },
  { model: "Metal Grip GT", sizeRange: "60.3 – 139.7mm", pressure: "37 – 32 Bar", notes: "High-pressure, compact grip" },
  { model: "Metal Grip Fire Fence", sizeRange: "26.9 – 406.4mm", pressure: "67 – 8 Bar", notes: "Fire-rated restraint coupling" },
  { model: "Eco Grip", sizeRange: "26.9 – 168.3mm", pressure: "6 Bar", notes: "Lightweight economy version" },
  { model: "Combi Grip", sizeRange: "38.0 – 162.0mm", pressure: "16 Bar", notes: "Mixed material connection" },
  { model: "Plast Grip", sizeRange: "39.0 – 162.0mm", pressure: "16 Bar", notes: "Designed for plastic pipes" },
  { model: "Flex 1L / 2 / 3 / 4", sizeRange: "48.3 – 4064.0mm", pressure: "25 – 1 Bar", notes: "Flexible, non-restrained" },
  { model: "Open Flex 1L / 2 / 3 / GT", sizeRange: "48.3 – 4064.0mm", pressure: "25 – 1 Bar", notes: "Split-body style for repair access" },
  { model: "Step Flex 2 / 3", sizeRange: "250.0 – 4094.0mm", pressure: "25 – 2 Bar", notes: "For joining different OD pipes" },
  { model: "Clamp SCE / SCZ", sizeRange: "44.0 – 420.0mm", pressure: "16 – 5 Bar", notes: "Encapsulating clamp for live repairs" },
]

// Orbit coupling models
const orbitCouplings = [
  { model: "Flex Grip S / L / 2–4", sizeRange: "20.0 – 4064.0mm", pressure: "32 – 2.5 Bar", notes: "Restrained pipe joining solution" },
  { model: "Flex Grip S & Flex Grip 2 S", sizeRange: "20.0 – 355.6mm", pressure: "32 – 8 Bar", notes: "Repair clamps with split sleeve" },
  { model: "Metal Lock S & Metal Lock L", sizeRange: "20.0 – 406.4mm", pressure: "32 – 12 Bar", notes: "High-strength stainless coupling" },
  { model: "Fire Protection Coupling", sizeRange: "20.0 – 406.4mm", pressure: "32 – 12 Bar", notes: "Fire system compatible" },
  { model: "Plast Coupling", sizeRange: "63.0 – 315.0mm", pressure: "20 – 16 Bar", notes: "Designed for PE/PVC pipe connections" },
  { model: "Combo Lock", sizeRange: "38.0 – 162.0mm", pressure: "16 Bar", notes: "For mixed pipe types (plastic + steel)" },
  { model: "Stepped Coupling", sizeRange: "30.0 – 114.3mm", pressure: "16 Bar", notes: "Joins mismatched diameter pipes" },
  { model: "Open Flex 200 L / 300 L / 400-L", sizeRange: "148.0 – 1524.0mm", pressure: "25 – 2 Bar", notes: "Non-restrained coupling" },
]

// Selection guide with product links
const selectionGuide = [
  {
    application: "Joining same-sized pipes",
    orbit: { name: "Flex Grip / Metal Lock", link: "/flex-grip-s-pipe-coupling" },
    straub: { name: "Metal Grip / Grip L", link: "/straub-metal-grip" }
  },
  {
    application: "Repair clamp for leaking section",
    orbit: { name: "Open Flex Series", link: "/flex-grip-open-l" },
    straub: { name: "Open Flex / Rep-Flex", link: "/straub-open-flex-1" }
  },
  {
    application: "Joining different OD pipes",
    orbit: { name: "Stepped Coupling", link: "/brands/orbit" },
    straub: { name: "Step Flex 2 / 3", link: "/straub-step-flex-2" }
  },
  {
    application: "Plastic-to-metal pipe join",
    orbit: { name: "Combo Lock", link: "/combo-lock" },
    straub: { name: "Combi Grip", link: "/straub-combi-grip" }
  },
  {
    application: "Fire systems",
    orbit: { name: "Fire Protection Coupling", link: "/fire-protection-coupling" },
    straub: { name: "Metal Grip Fire Fence", link: "/brands/straub" }
  },
  {
    application: "Misalignment or movement",
    orbit: { name: "Flex Grip / Open Flex", link: "/flex-grip-l-pipe-coupling" },
    straub: { name: "Flex / Open Flex", link: "/straub-flex-1" }
  },
  {
    application: "Plastic pipes (PE/PVC)",
    orbit: { name: "Plast Coupling", link: "/plast-coupling" },
    straub: { name: "Plast Grip / Plast Pro", link: "/straub-plast-grip" }
  },
]

const applications = [
  "Pressure systems (potable water, mining, industrial plants)",
  "Drainage and sewer lines",
  "Fire protection systems",
  "Temporary or emergency repairs",
  "Vibration and movement zones (e.g., pump stations)",
  "Joining dissimilar materials (PVC to HDPE, steel to ductile iron)",
]

const installationNotes = [
  "All couplings require minimal pipe prep – no welding, threading, or beveling.",
  "Torque values are indicated on each coupling.",
  "Open-style couplings (Straub Open Flex, Orbit Open Flex) are ideal for retrofit work.",
]

const faqs = [
  {
    question: "Can I use Orbit or Straub couplings on potable water lines?",
    answer: "Yes – Orbit couplings are fitted with WRAS-approved EPDM rubber seals suitable for potable water.",
  },
  {
    question: "What's the difference between restrained and non-restrained couplings?",
    answer: "Restrained couplings (e.g., Flex Grip, Metal Grip) prevent axial pipe movement. Non-restrained versions (e.g., Flex/Open Flex) allow for movement and vibration but need pipe anchoring.",
  },
  {
    question: "Do you ship across Australia?",
    answer: "Yes – we offer free delivery Australia-wide on most couplings.",
  },
  {
    question: "What's the lead time?",
    answer: "Most Orbit models are in stock and ship within 1–2 business days. Straub lead times vary based on model and size – contact us for ETA.",
  },
  {
    question: "What if my pipe diameters don't match exactly?",
    answer: "Use a stepped coupling or consult us for a custom-fit recommendation.",
  },
]

export default async function PipeCouplingsPage() {
  // Get all coupling products from database
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
      <USPBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Minimal Hero */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Pipe Couplings</h1>
          <p className="text-muted-foreground">
            316 stainless steel couplings for joining, repair, and transition applications.
          </p>
        </div>

        {/* Shop by Brand */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Shop by Brand</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brands.map((brand) => (
              <Link key={brand.slug} href={`/brands/${brand.slug}`}>
                <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full flex items-center gap-4">
                  <div className={`relative flex-shrink-0 ${brand.slug === 'orbit' ? 'h-[52px] w-[146px]' : 'h-10 w-28'}`}>
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

        {/* Selection Guide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Selecting the Right Pipe Coupling</h2>
          <p className="text-muted-foreground mb-4">
            Choose the right coupling for your application. Both brands offer equivalent solutions – select based on availability or preference.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Application</th>
                  <th className="text-left p-3 font-medium">
                    <span className="block">Recommended</span>
                    <span className="text-xs text-muted-foreground font-normal">(Orbit)</span>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <span className="block">Recommended</span>
                    <span className="text-xs text-muted-foreground font-normal">(Straub)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectionGuide.map((item, index) => (
                  <tr key={item.application} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    <td className="p-3">{item.application}</td>
                    <td className="p-3 font-medium">
                      <Link href={item.orbit.link} className="text-primary hover:underline">
                        {item.orbit.name}
                      </Link>
                    </td>
                    <td className="p-3 font-medium">
                      <Link href={item.straub.link} className="text-primary hover:underline">
                        {item.straub.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {/* Compare Pipe Coupling Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Compare Pipe Coupling Options</h2>
          <p className="text-muted-foreground mb-8">
            Use the tables below to compare Straub and Orbit pipe coupling models by application type, size range, and pressure rating.
          </p>

          {/* Straub Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Straub Couplings – Swiss Engineered Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Model</th>
                    <th className="text-left p-3 font-medium">Size Range</th>
                    <th className="text-left p-3 font-medium">Pressure Rating</th>
                    <th className="text-left p-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {straubCouplings.map((coupling, index) => (
                    <tr key={coupling.model} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="p-3 font-medium">{coupling.model}</td>
                      <td className="p-3">{coupling.sizeRange}</td>
                      <td className="p-3">{coupling.pressure}</td>
                      <td className="p-3 text-muted-foreground">{coupling.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orbit Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Orbit Couplings – Australian Industrial Range</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Model</th>
                    <th className="text-left p-3 font-medium">Size Range</th>
                    <th className="text-left p-3 font-medium">Pressure Rating</th>
                    <th className="text-left p-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {orbitCouplings.map((coupling, index) => (
                    <tr key={coupling.model} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="p-3 font-medium">{coupling.model}</td>
                      <td className="p-3">{coupling.sizeRange}</td>
                      <td className="p-3">{coupling.pressure}</td>
                      <td className="p-3 text-muted-foreground">{coupling.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Common Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Notes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Installation Notes</h2>
          <div className="space-y-3">
            {installationNotes.map((note) => (
              <div key={note} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
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
            for your application. Call us on (08) 9271 2577 or request a quote.
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
