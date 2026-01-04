import Link from "next/link"
import { CheckCircle, Clock, Shield, Wrench, AlertTriangle } from "lucide-react"
import { getProductsByCategory, getSubcategoriesByCategory } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import USPBar from "@/components/USPBar"
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
    "Pipe repair clamps and couplings for emergency and permanent leak repairs. Straub and Orbit repair solutions. No pipe cutting required. 316 stainless steel. Fast Australia-wide delivery.",
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
    description: "Repair leaks in minutes. No pipe cutting, no welding, no special tools required.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Ready",
    description: "Keep stock on hand for emergency repairs. Seal leaks under pressure in many cases.",
  },
  {
    icon: Shield,
    title: "Permanent Solution",
    description: "Not just a band-aid fix. Properly installed repairs last the lifetime of the pipe.",
  },
  {
    icon: Wrench,
    title: "Multi-Purpose",
    description: "Same couplings used for joining can repair leaks, cracks, and damaged sections.",
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
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <USPBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title + Description */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4" />
            Emergency & Permanent Solutions
          </div>
          <h1 className="text-3xl font-bold mb-2">Pipe Repair Solutions</h1>
          <p className="text-muted-foreground max-w-3xl">
            Seal leaks, repair cracks, and fix damaged pipes without cutting or welding.
            Our repair clamps and couplings provide fast, permanent repairs that last
            the lifetime of the pipe.
          </p>
        </div>

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
          basePath="/pipe-repair"
        />

        {/* All Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Repair Products</h2>
            <span className="text-muted-foreground">{repairProducts.length} products</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-md font-medium hover:bg-accent transition-colors"
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
