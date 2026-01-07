import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Clock, Shield, Wrench, AlertTriangle, ArrowRight } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"
import SubcategoryTiles from "@/components/SubcategoryTiles"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pipe Repair Clamps & Couplings | Emergency Repairs | Dewater Products",
  description:
    "Repair clamps designed to safely and reliably seal damaged pipes – steel, cast iron, ductile iron, and plastic. No welding, no prep. Fast permanent repairs. Australia-wide delivery.",
  keywords: [
    "pipe repair clamps",
    "pipe repair couplings",
    "emergency pipe repair",
    "leak repair clamps",
    "pipe leak repair",
    "Straub repair clamps",
    "Orbit repair clamps",
    "pipe crack repair",
  ],
  openGraph: {
    title: "Pipe Repair Clamps & Couplings | Dewater Products",
    description: "Emergency and permanent pipe repair solutions. No pipe cutting, no shutdown required.",
    type: "website",
  },
  alternates: {
    canonical: "https://dewater-products.vercel.app/pipe-repair",
  },
}

export const revalidate = 60

const repairBenefits = [
  {
    icon: Clock,
    title: "Fast Installation",
    description: "No welding, no prep, no special tools. Only a torque wrench required to install.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Ready",
    description: "Safely and reliably seal damaged pipes. Stock on hand for emergency repairs.",
  },
  {
    icon: Shield,
    title: "Permanent Solution",
    description: "Not just a band-aid fix. Properly installed repairs last the lifetime of the pipe.",
  },
  {
    icon: Wrench,
    title: "All Pipe Materials",
    description: "Works on steel, cast iron, ductile iron, fibre cement, and plastic pipes.",
  },
]

const repairScenarios = [
  {
    problem: "Pinhole Leaks",
    solution: "Repair clamp or coupling slides over the leak area and seals with EPDM gasket.",
  },
  {
    problem: "Cracked Pipes",
    solution: "Use a repair clamp wide enough to span the entire crack for complete sealing.",
  },
  {
    problem: "Corroded Sections",
    solution: "Pipe couplings can bridge damaged sections without cutting out the pipe.",
  },
  {
    problem: "Joint Failures",
    solution: "Replace failed mechanical joints with reliable coupling connections.",
  },
]

const faqs = [
  {
    question: "Can I repair a pipe without shutting down the system?",
    answer:
      "In many cases, yes. Repair clamps can be installed on pressurised systems for small leaks. For larger repairs, you may need to depressurise but typically don't need to drain the system.",
  },
  {
    question: "What's the difference between repair clamps and couplings?",
    answer:
      "Repair clamps are specifically designed to wrap around a damaged section of pipe. Couplings join two pipe ends but can also be used for repair by sliding over a damaged area. Both seal with EPDM gaskets.",
  },
  {
    question: "How do I choose the right width repair clamp?",
    answer:
      "The clamp should be wide enough to fully cover the damaged area plus 50mm on each side. For cracks, ensure the entire crack length is within the sealing area. 55mm clamps suit pinholes, 150-300mm for larger damage.",
  },
  {
    question: "Are these repairs permanent or temporary?",
    answer:
      "Both repair clamps and couplings provide permanent repairs when properly installed. The stainless steel construction and EPDM seals are designed for long-term service.",
  },
]

export default async function PipeRepairPage() {
  // Get all products and subcategories
  const [pipeCouplingsProducts, repairClampsProducts, repairSubcategories] = await Promise.all([
    getProductsByCategory('pipe-couplings'),
    getProductsByCategory('pipe-repair-clamps'),
    getSubcategoriesByCategory('pipe-repair-clamps'),
  ])
  const repairProducts = [...pipeCouplingsProducts, ...repairClampsProducts]

  const breadcrumbs = [
    { name: "Home", url: "https://dewater-products.vercel.app" },
    { name: "Pipe Repair", url: "https://dewater-products.vercel.app/pipe-repair" },
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
                <AlertTriangle className="w-4 h-4" />
                Emergency & Permanent Solutions
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Pipe Repair Solutions
              </h1>
              <p className="text-xl text-white/80 mb-6 max-w-2xl">
                Repair clamps designed to safely and reliably seal damaged pipes made from steel, cast iron, ductile iron, and plastic. No welding, no prep – just fast, permanent repairs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="btn-swipe btn-swipe-to-white inline-flex items-center px-6 py-3 border rounded-md font-medium shadow-lg"
                >
                  View Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <a
                  href="tel:1300271290"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors border border-red-600"
                >
                  Emergency: 1300 271 290
                </a>
              </div>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <Image
                  src="https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/OCFG-L/FlexGripL-zzJYJLnKNuq2HTttSKJXZBXzkFBvoz.png"
                  alt="Flex Grip L Pipe Coupling"
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
        {/* Benefits - Critical Info */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Why Use Pipe Repair Clamps?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {repairBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-4 rounded-lg bg-card border border-border"
              >
                <benefit.icon className="w-8 h-8 text-red-600 dark:text-red-400 mb-3" />
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search by Type - Subcategory Tiles */}
        <SubcategoryTiles
          categorySlug="pipe-repair-clamps"
          subcategories={repairSubcategories}
          title="Search by Type"
          hideEmpty={true}
          urlMap={{
            'orbit-pipe-repair-clamps': '/pipe-repair-clamps',
            'straub-pipe-repair-clamps': '/pipe-repair-clamps',
          }}
        />

        {/* All Products */}
        <div id="products" className="mb-12 scroll-mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Repair Products</h2>
            <span className="text-muted-foreground">{repairProducts.length} products</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {repairProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Common Repair Scenarios */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Common Repair Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repairScenarios.map((scenario) => (
              <div key={scenario.problem} className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{scenario.problem}</h3>
                  <p className="text-sm text-muted-foreground">{scenario.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Pipe Repair FAQs</h2>
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

        {/* CTA */}
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Emergency Pipe Repair?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Call our team for urgent assistance. We can advise on the right repair solution
            and arrange fast dispatch from our Perth warehouse.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="tel:1300271290"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Call 1300 271 290
            </a>
            <Link
              href="/request-quote"
              className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium"
            >
              Request a Quote
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
