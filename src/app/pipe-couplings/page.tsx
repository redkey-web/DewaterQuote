import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Download, Link2 } from "lucide-react"
import { getProductsByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pipe Couplings | Straub, Orbit & Teekay Couplings Australia | Dewater Products",
  description:
    "High-performance pipe couplings for all pipe materials. No welding, no prep – only a torque wrench required. Straub, Orbit & Teekay plain-end couplings. Save time and money. Australia-wide delivery.",
  keywords: [
    "pipe couplings",
    "pipe couplings Australia",
    "Straub couplings",
    "Orbit couplings",
    "Teekay couplings",
    "Axilock coupling",
    "Axiflex coupling",
    "flexible pipe couplings",
    "restrained pipe couplings",
    "316 stainless steel couplings",
  ],
  openGraph: {
    title: "Pipe Couplings - Straub, Orbit & Teekay | Dewater Products",
    description: "Flexible and restrained pipe couplings for pressure, drainage, and suction pipelines.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewaterproducts.com.au/pipe-couplings",
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
  {
    name: "Teekay",
    slug: "teekay",
    description: "Axilock, Axiflex and PRIMA range for steel, PE and PVC pipes. No welding required.",
    logo: "/images/brands/teekay-logo.png",
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

// Teekay coupling models
const teekayCouplings = [
  { model: "Axilock", sizeRange: "21.0 – 2200.0mm", pressure: "PN16", notes: "Rigid axially restrained coupling" },
  { model: "Axilock-FP", sizeRange: "26.9 – 168.3mm", pressure: "PN16", notes: "Fire protection certified" },
  { model: "Axiflex", sizeRange: "21.0 – 2200.0mm", pressure: "PN16", notes: "Flexible with ±4° deflection" },
  { model: "Plastlock", sizeRange: "32.0 – 630.0mm", pressure: "PN16", notes: "Designed for PE/PVC plastic pipes" },
  { model: "PRIMA-LOCK", sizeRange: "26.9 – 610.0mm", pressure: "PN16", notes: "Premium rigid coupling" },
  { model: "PRIMA-FLEX", sizeRange: "26.9 – 610.0mm", pressure: "PN16", notes: "Premium flexible coupling" },
  { model: "PRIMA-PLAST", sizeRange: "32.0 – 315.0mm", pressure: "PN16", notes: "Premium plastic pipe coupling" },
  { model: "PRIMA-STEP", sizeRange: "26.9 – 219.1mm", pressure: "PN16", notes: "Stepped reducer coupling" },
]

// Selection guide with product links
const selectionGuide = [
  {
    application: "Joining same-sized pipes",
    orbit: { name: "Flex Grip / Metal Lock", link: "/flex-grip-s-pipe-coupling" },
    straub: { name: "Metal Grip / Grip L", link: "/straub-metal-grip" },
    teekay: { name: "Axilock / PRIMA-LOCK", link: "/teekay" }
  },
  {
    application: "Repair clamp for leaking section",
    orbit: { name: "Open Flex Series", link: "/flex-grip-open-l" },
    straub: { name: "Open Flex / Rep-Flex", link: "/straub-open-flex-1" },
    teekay: { name: "Axilock", link: "/teekay" }
  },
  {
    application: "Joining different OD pipes",
    orbit: { name: "Stepped Coupling", link: "/orbit-couplings" },
    straub: { name: "Step Flex 2 / 3", link: "/straub-step-flex-2" },
    teekay: { name: "PRIMA-STEP", link: "/teekay" }
  },
  {
    application: "Plastic-to-metal pipe join",
    orbit: { name: "Combo Lock", link: "/combo-lock" },
    straub: { name: "Combi Grip", link: "/straub-combi-grip" },
    teekay: { name: "Plastlock", link: "/teekay" }
  },
  {
    application: "Fire systems",
    orbit: { name: "Fire Protection Coupling", link: "/fire-protection-coupling" },
    straub: { name: "Metal Grip Fire Fence", link: "/straub-couplings" },
    teekay: { name: "Axilock-FP", link: "/teekay" }
  },
  {
    application: "Misalignment or movement",
    orbit: { name: "Flex Grip / Open Flex", link: "/flex-grip-l-pipe-coupling" },
    straub: { name: "Flex / Open Flex", link: "/straub-flex-1" },
    teekay: { name: "Axiflex / PRIMA-FLEX", link: "/teekay" }
  },
  {
    application: "Plastic pipes (PE/PVC)",
    orbit: { name: "Plast Coupling", link: "/plast-coupling" },
    straub: { name: "Plast Grip / Plast Pro", link: "/straub-plast-grip" },
    teekay: { name: "Plastlock / PRIMA-PLAST", link: "/teekay" }
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
  "No pipe end preparation required – no welding, threading, or beveling.",
  "Only a torque wrench needed to install. Torque values indicated on each coupling.",
  "Open-style couplings (Straub Open Flex, Orbit Open Flex) are ideal for retrofit and repair work.",
  "Save time, space, and money compared to traditional flanged or welded connections.",
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

// Application-based product ordering (matching selection guide)
const applicationOrder: Record<string, number> = {
  // 1. Joining same-sized pipes - Standard couplings
  'flex-grip-s-pipe-coupling': 1,
  'flex-grip-l-pipe-coupling': 2,
  'flex-grip-2-l-pipe-coupling': 3,
  'metal-lock-s-pipe-coupling': 4,
  'metal-lock-l-pipe-coupling': 5,
  'straub-metal-grip': 6,
  'straub-grip-l': 7,
  'teekay-axilock': 8,
  'teekay-prima-lock': 9,
  // 2. Repair clamps for leaking section
  'flex-grip-open-l': 10,
  'flex-grip-2-s-repair-clamp': 11,
  'straub-open-flex-1': 12,
  'straub-open-flex-2': 13,
  // 3. Joining different OD pipes - Stepped
  'orbit-stepped-coupling': 15,
  'straub-step-flex-2': 16,
  'straub-step-flex-3': 17,
  'teekay-prima-step': 18,
  // 4. Plastic-to-metal pipe join
  'combo-lock': 19,
  'straub-combi-grip': 20,
  'teekay-plastlock': 21,
  // 5. Fire systems
  'fire-protection-coupling': 22,
  'straub-metal-grip-fire-fence': 23,
  'teekay-axilock-fp': 24,
  // 6. Misalignment or movement - Flexible couplings
  'straub-flex-1': 25,
  'straub-flex-2': 26,
  'teekay-axiflex': 27,
  'teekay-prima-flex': 28,
  // 7. Plastic pipes (PE/PVC)
  'plast-coupling': 29,
  'straub-plast-grip': 30,
  'teekay-prima-plast': 31,
}

function sortByApplication(products: Awaited<ReturnType<typeof getProductsByCategory>>) {
  return [...products].sort((a, b) => {
    const orderA = applicationOrder[a.slug] ?? 100
    const orderB = applicationOrder[b.slug] ?? 100
    return orderA - orderB
  })
}

export default async function PipeCouplingsPage() {
  // Get all coupling products from database
  const [pipeCouplingsProducts, repairClampsProducts] = await Promise.all([
    getProductsByCategory('pipe-couplings'),
    getProductsByCategory('pipe-repair-clamps'),
  ])
  const couplingProducts = sortByApplication([...pipeCouplingsProducts, ...repairClampsProducts])

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: "Pipe Couplings", url: "https://dewaterproducts.com.au/pipe-couplings" },
  ]

  return (
    <div className="min-h-screen bg-stone-200 dark:bg-stone-900">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        {/* Animated blob background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Dark base for white text, lighter at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-400" />
          {/* Blob 1 - Cyan brand color (large, top-left) */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob"
            style={{ backgroundColor: '#39C5DA' }}
          />
          {/* Blob 2 - Teal accent (right side) */}
          <div
            className="absolute top-20 -right-32 w-[450px] h-[450px] rounded-full opacity-40 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#2DD4BF' }}
          />
          {/* Blob 3 - Dark navy (bottom, adds depth) */}
          <div
            className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-full opacity-60 blur-3xl animate-blob animation-delay-4000"
            style={{ backgroundColor: '#0f172a' }}
          />
          {/* Blob 4 - Dark slate (center-left, behind text) */}
          <div
            className="absolute top-0 left-0 w-[700px] h-[500px] rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"
            style={{ backgroundColor: '#1e293b' }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39C5DA] text-white text-sm font-medium mb-4">
                <Link2 className="w-4 h-4" />
                Pipe Joining Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Pipe Couplings
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">
                High-performance pipe couplings for all pipe materials. No welding, no prep –
                only a torque wrench required. Save time and money with reliable plain-end couplings.
              </p>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/OCFG2-L/FlexGrip2L-ioSOpYze60EFhcsHXbS2SiyFE1Luug.png"
                  alt="Orbit Flex Grip 2L Pipe Coupling 316SS"
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
        {/* Shop by Brand */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Shop by Brand</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <Link key={brand.slug} href={brand.slug === 'orbit' ? '/orbit-couplings' : brand.slug === 'straub' ? '/straub-couplings' : '/teekay'}>
                <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full flex items-center gap-4">
                  <div className={`relative flex-shrink-0 ${brand.slug === 'orbit' ? 'h-[62px] w-[175px]' : brand.slug === 'teekay' ? 'h-12 w-32' : 'h-10 w-28'}`}>
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
            Pipe couplings eliminate the need for pipe end preparation – no welding, threading, or beveling. Choose the right coupling for your application below. All three brands offer equivalent solutions for steel, cast iron, ductile iron, and plastic pipes.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Application</th>
                  <th className="text-left p-3 font-medium">
                    <span className="block">Orbit</span>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <span className="block">Straub</span>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <span className="block">Teekay</span>
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
                    <td className="p-3 font-medium">
                      <Link href={item.teekay.link} className="text-primary hover:underline">
                        {item.teekay.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Products */}
        <div id="products" className="mb-12 scroll-mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Pipe Couplings</h2>
            <span className="text-muted-foreground">{couplingProducts.length} products</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {couplingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Compare Pipe Coupling Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Compare Pipe Coupling Options</h2>
          <p className="text-muted-foreground mb-8">
            Use the tables below to compare Straub, Orbit and Teekay pipe coupling models by application type, size range, and pressure rating.
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
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span>*Up to 5 Yrs Warranty</span>
              <a
                href="/downloads/orbit-couplings-5-year-warranty.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Download className="w-4 h-4" />
                Download Warranty PDF
              </a>
            </div>
          </div>

          {/* Teekay Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Teekay Couplings – Axilock, Axiflex & PRIMA Range</h3>
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
                  {teekayCouplings.map((coupling, index) => (
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
            <div className="mt-3 text-sm text-muted-foreground">
              <Link href="/teekay" className="text-primary hover:underline">
                View all Teekay products →
              </Link>
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
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`} className="bg-card border border-border rounded-lg px-4">
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
            <Link href="/bore-flex">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer">
                <span className="font-medium">Bore-Flex Expansion Joints</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Coupling?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you choose between Straub, Orbit and Teekay couplings
            for your application. Call us on <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.
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
