import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Metadata } from "next"
// Static data for generateStaticParams (build-time stability)
import {
  categories as catalogCategories,
  subcategories as catalogSubcategories,
} from "@/data/catalog"
// Database queries for runtime data fetching
import {
  getSubcategoryBySlug,
  getCategoryBySlug,
  getProductsBySubcategory,
} from "@/data/products"
import ProductCard from "@/components/ProductCard"
import { BreadcrumbJsonLd } from "@/components/JsonLd"
import BulkPricingTicker from "@/components/BulkPricingTicker"

// SEO-optimized content for each subcategory
const subcategoryContent: Record<string, {
  title: string
  metaDescription: string
  heroDescription: string
  longDescription: string
  features?: string[]
  applications?: string[]
  faqs?: { question: string; answer: string }[]
}> = {
  // Valves subcategories
  "butterfly-valve": {
    title: "Butterfly Valves",
    metaDescription: "Industrial butterfly valves in 316 stainless steel and ductile iron. Wafer and lug designs for water, process, and HVAC applications. PN16 rated. Australia-wide delivery.",
    heroDescription: "Quarter-turn valves with a rotating disc for efficient flow control. Compact design ideal for large diameter pipes and space-constrained installations.",
    longDescription: "Butterfly valves provide cost-effective flow control for water, air, and gas applications. The rotating disc design offers quick operation with minimal pressure drop. Our range includes stainless steel CF8M bodies with PTFE seats for chemical resistance, and ductile iron options for general water service.",
    features: [
      "Quarter-turn operation for quick shutoff",
      "Compact wafer design saves space",
      "Available in 316SS (CF8M) and ductile iron",
      "PTFE and EPDM seat options",
      "Lever or gear operated",
      "PN16 pressure rating"
    ],
    applications: ["Water treatment plants", "HVAC systems", "Process industries", "Fire protection"],
  },
  "duckbill-check-valve": {
    title: "Duckbill Check Valves",
    metaDescription: "Duckbill check valves for stormwater outfalls and backflow prevention. Neoprene, EPDM, and NBR rubber. Slip-on installation. No moving parts to maintain.",
    heroDescription: "Elastomeric check valves that flex open under flow pressure and seal flat under backflow. Zero maintenance with no mechanical parts.",
    longDescription: "Duckbill check valves are ideal for outfall applications, stormwater systems, and wastewater discharge. The flexible rubber construction eliminates the maintenance issues of mechanical check valves. Available in Neoprene for general use, EPDM for potable water (WRAS approved), and NBR for oily applications.",
    features: [
      "No moving parts - zero maintenance",
      "Self-draining design prevents standing water",
      "Opens with minimal head pressure (25mm)",
      "Curved bill design for better sealing",
      "Available in Neoprene, EPDM, NBR, Viton",
      "316SS clamping bands"
    ],
    applications: ["Storm water outfalls", "Pump stations", "Tide gates", "Backflow prevention"],
  },
  "gate-valve": {
    title: "Gate Valves",
    metaDescription: "Resilient seated gate valves in ductile iron. Full bore design for water distribution and sewerage. Non-rising stem. AS/NZS 2638 compliant. WRAS approved seals.",
    heroDescription: "Full-bore isolation valves for water distribution, sewerage, and fire protection. Non-rising stem design ideal for underground installation.",
    longDescription: "Our resilient seated gate valves feature a ductile iron body with EPDM-encapsulated disc for bubble-tight shutoff. The non-rising stem design makes them perfect for underground installation in valve pits. Epoxy coated to AS/NZS 4158 for corrosion protection.",
    features: [
      "Full bore - no flow restriction",
      "EPDM fully encapsulated disc",
      "Non-rising stem design",
      "Ductile iron body",
      "Epoxy powder coated",
      "WRAS approved seals"
    ],
    applications: ["Water distribution networks", "Sewerage systems", "Fire hydrant systems", "Irrigation"],
  },
  "ball-valve": {
    title: "Ball Valves",
    metaDescription: "316 stainless steel ball valves. Full bore, flanged and threaded options. Fire-safe design. PN40 rated for water, gas, and chemical applications.",
    heroDescription: "Quarter-turn shut-off valves with a rotating ball for precise flow control. Full bore design minimises pressure drop.",
    longDescription: "Ball valves offer reliable on/off control with quick quarter-turn operation. Our 316 stainless steel range includes full-bore designs for minimal pressure drop and fire-safe certification for critical applications. PTFE seats provide excellent chemical resistance.",
    features: [
      "Full bore design - minimal pressure drop",
      "316 stainless steel construction",
      "PTFE seats and seals",
      "Fire-safe certified (API 607)",
      "Lever with lockable device",
      "PN40 pressure rating"
    ],
    applications: ["Chemical plants", "Process industries", "Oil and gas", "Water treatment"],
  },
  "foot-valve": {
    title: "Foot Valves",
    metaDescription: "Foot valves with integrated strainers for pump suction lines. Galvanised and stainless steel. Prevents backflow and maintains pump prime. Table D flanged.",
    heroDescription: "Suction line check valves with integrated strainers. Prevents backflow and keeps pumps primed for reliable operation.",
    longDescription: "Foot valves are installed at the bottom of pump suction lines to maintain prime and prevent backflow when the pump stops. The integrated strainer protects the pump from debris. Available in galvanised steel for general water service and stainless steel for corrosive applications.",
    features: [
      "Integrated strainer design",
      "Maintains pump prime",
      "Prevents backflow",
      "Table D flanged connections",
      "EPDM seals",
      "Available in galvanised and SS"
    ],
    applications: ["Pump suction lines", "Irrigation systems", "Water supply", "Agricultural pumping"],
  },

  // Pipe Couplings subcategories
  "orbit-couplings": {
    title: "Orbit Pipe Couplings",
    metaDescription: "Orbit flexible pipe couplings - Flex Grip and Metal Lock series. 316 stainless steel with EPDM seals. WRAS approved. Australian alternative to Straub couplings.",
    heroDescription: "Australian-made flexible pipe couplings for joining plain-ended pipes. No welding, threading, or special tools required.",
    longDescription: "Orbit Couplings provide a fast, reliable method for joining pipes of the same or different materials. The Flex Grip range allows for axial movement and vibration absorption, while Metal Lock couplings provide axial restraint for pull-out resistance. All feature 316 stainless steel construction with WRAS-approved EPDM seals.",
    features: [
      "316 stainless steel construction",
      "WRAS approved EPDM seals",
      "No welding or special tools required",
      "Flex Grip - allows axial movement",
      "Metal Lock - provides axial restraint",
      "Equivalent to Straub couplings"
    ],
    applications: ["Pipe repairs", "Joining dissimilar materials", "Vibration isolation", "Thermal expansion absorption"],
  },

  // Pipe Repair Clamps subcategories
  "orbit-pipe-repair-clamps": {
    title: "Orbit Pipe Repair Clamps",
    metaDescription: "Orbit pipe repair clamps in 316 stainless steel. Emergency and permanent leak repairs. WRAS approved EPDM seals. 55mm to 300mm widths available.",
    heroDescription: "Stainless steel repair clamps for emergency and permanent pipe repairs. Wrap around damaged sections to seal leaks and cracks.",
    longDescription: "Orbit Pipe Repair Clamps provide fast, reliable repairs for leaking or damaged pipelines. Available in 55mm, 200mm, and 300mm widths to cover different damage sizes. 316 stainless steel construction with WRAS-approved EPDM rubber ensures long-lasting performance. For repair use only - not suitable as pipe couplings.",
    features: [
      "316 stainless steel construction",
      "WRAS approved EPDM rubber",
      "Multiple widths available",
      "Reinforced mesh backing (200mm+)",
      "Quick emergency installation",
      "Suitable for permanent repairs"
    ],
    applications: ["Emergency pipe repairs", "Leak sealing", "Crack repairs", "Pipeline maintenance"],
  },

  // Strainers subcategories
  "y-strainer": {
    title: "Y Strainers",
    metaDescription: "Y strainers in 316 stainless steel and cast iron. Pipeline filtration for pump protection. 1mm mesh standard. ANSI 150LB and PN16 flanged.",
    heroDescription: "Compact Y-pattern strainers for continuous pipeline filtration. Protects pumps, valves, and equipment from debris.",
    longDescription: "Y strainers provide economical pipeline filtration where debris levels are low and cleaning is infrequent. The Y-shaped body allows horizontal or vertical installation. 316 stainless steel CF8M bodies for corrosive fluids, cast iron for general water service. Removable screen baskets for easy cleaning.",
    features: [
      "Compact Y-pattern design",
      "Horizontal or vertical installation",
      "316SS or cast iron bodies",
      "Removable SS mesh screen",
      "1mm mesh standard (others available)",
      "ANSI 150LB / PN16 flanged"
    ],
    applications: ["Pre-pump protection", "Process water", "Chemical plants", "HVAC systems"],
  },
  "simplex-basket-strainer": {
    title: "Simplex Basket Strainers",
    metaDescription: "Simplex basket strainers in 316 stainless steel. Higher flow rates than Y strainers. Easy basket removal. ANSI 150LB flanged. For water and process applications.",
    heroDescription: "Single basket strainers with larger filtration area than Y strainers. Easy basket removal for frequent cleaning applications.",
    longDescription: "Simplex basket strainers offer higher flow rates and easier maintenance than Y strainers, making them ideal for applications requiring frequent cleaning. The larger basket provides more filtration area with less pressure drop. 316 stainless steel construction suitable for potable water, chemicals, and corrosive fluids.",
    features: [
      "Larger filtration area than Y strainers",
      "Easy top-access basket removal",
      "Lower pressure drop",
      "316 stainless steel body and basket",
      "Quick-open cover option",
      "Multiple mesh sizes available"
    ],
    applications: ["High-flow applications", "Process water", "Food & beverage", "Pharmaceuticals"],
  },

  // Rubber Expansion Joints subcategories
  "single-sphere": {
    title: "Single Sphere Rubber Expansion Joints",
    metaDescription: "Single sphere rubber expansion joints. EPDM rubber with zinc or 316SS flanges. Absorbs vibration and thermal expansion. PN16 rated. WRAS approved.",
    heroDescription: "Flexible rubber joints for absorbing thermal expansion, vibration, and pipe misalignment. Single sphere design handles one movement direction.",
    longDescription: "Single sphere rubber expansion joints provide flexible connections that absorb thermal expansion, reduce vibration transmission, and accommodate pipe misalignment. EPDM rubber construction with nylon reinforcement. Available with zinc-plated steel or 316 stainless steel flanges. WRAS approved for potable water applications.",
    features: [
      "Absorbs thermal expansion",
      "Reduces vibration transmission",
      "WRAS approved EPDM rubber",
      "Nylon fabric reinforcement",
      "Zinc or 316SS flanges",
      "PN16 pressure rating"
    ],
    applications: ["Pump connections", "HVAC systems", "Chiller plants", "Water treatment"],
  },

  // Flange Adaptors subcategories
  "flange-adaptor": {
    title: "Flange Adaptors",
    metaDescription: "316 stainless steel flange adaptors. Connect plain-ended pipes to flanged equipment. EPDM seals. Wide size range 30mm to 4064mm OD. WRAS approved.",
    heroDescription: "Versatile adaptors for connecting plain-ended pipes to flanged equipment. 316 stainless steel with EPDM seals.",
    longDescription: "Flange adaptors provide a simple method for connecting plain-ended pipes to flanged valves, pumps, and equipment. 316 stainless steel construction ensures corrosion resistance. WRAS-approved EPDM seals are suitable for potable water. Available in sizes from 30mm to 4064mm OD with various flange standards.",
    features: [
      "316 stainless steel body",
      "WRAS approved EPDM seals",
      "Wide size range: 30-4064mm OD",
      "Multiple flange standards",
      "No welding required",
      "PN16 pressure rating"
    ],
    applications: ["Pipe-to-flange connections", "Pump connections", "Valve installations", "Pipe repairs"],
  },
}

interface SubcategoryPageProps {
  params: Promise<{
    slug: string
    subcategory: string
  }>
}

// Generate static params for all valid category/subcategory combinations
// Uses static catalog for build-time stability
export async function generateStaticParams() {
  const params: { slug: string; subcategory: string }[] = []

  for (const cat of catalogCategories) {
    const catSubcategories = catalogSubcategories.filter((s) => s.category === cat.slug)
    for (const subcat of catSubcategories) {
      params.push({
        slug: cat.slug,
        subcategory: subcat.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { slug: category, subcategory } = await params

  const [categoryData, subcategoryData] = await Promise.all([
    getCategoryBySlug(category),
    getSubcategoryBySlug(subcategory),
  ])
  const content = subcategoryContent[subcategory]

  if (!categoryData || !subcategoryData || subcategoryData.category !== category) {
    return {
      title: "Not Found",
    }
  }

  return {
    title: `${content?.title || subcategoryData.name} | ${categoryData.name} | Dewater Products`,
    description: content?.metaDescription || subcategoryData.description,
    openGraph: {
      title: `${content?.title || subcategoryData.name} - Dewater Products`,
      description: content?.metaDescription || subcategoryData.description,
      type: "website",
      url: `https://dewaterproducts.com.au/${category}/${subcategory}`,
    },
    alternates: {
      canonical: `https://dewaterproducts.com.au/${category}/${subcategory}`,
    },
  }
}

// ItemList JSON-LD for product listing pages
function ItemListJsonLd({
  products,
  category,
  subcategory,
}: {
  products: { name: string; slug: string; images: { url: string }[] }[]
  category: string
  subcategory: string
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `https://dewaterproducts.com.au/${product.slug}`,
      image: product.images[0]?.url,
    })),
    numberOfItems: products.length,
    name: `${subcategoryContent[subcategory]?.title || subcategory} products`,
    description: subcategoryContent[subcategory]?.heroDescription,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// FAQ JSON-LD
function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const jsonLd = {
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
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug: category, subcategory } = await params

  const [categoryData, subcategoryData] = await Promise.all([
    getCategoryBySlug(category),
    getSubcategoryBySlug(subcategory),
  ])

  // Validate the subcategory belongs to this category
  if (!categoryData || !subcategoryData || subcategoryData.category !== category) {
    notFound()
  }

  const products = await getProductsBySubcategory(category, subcategory)
  const content = subcategoryContent[subcategory]

  const breadcrumbs = [
    { name: "Home", url: "https://dewaterproducts.com.au" },
    { name: categoryData.name, url: `https://dewaterproducts.com.au/${category}` },
    { name: content?.title || subcategoryData.name, url: `https://dewaterproducts.com.au/${category}/${subcategory}` },
  ]

  return (
    <div className="min-h-screen bg-[#EDEDED] dark:bg-stone-900">
      {/* JSON-LD Schema */}
      <BreadcrumbJsonLd items={breadcrumbs} />
      {products.length > 0 && (
        <ItemListJsonLd products={products} category={category} subcategory={subcategory} />
      )}
      {content?.faqs && <FAQJsonLd faqs={content.faqs} />}
      <BulkPricingTicker variant="teal" />

      {/* Dark grey strip under header/ticker */}
      <div className="bg-gradient-to-b from-slate-700 to-slate-500 h-12" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${category}`} className="hover:text-foreground transition-colors">
            {categoryData.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{content?.title || subcategoryData.name}</span>
        </nav>

        {/* Hero Section - Minimal */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{content?.title || subcategoryData.name}</h1>
          <p className="text-muted-foreground">
            {content?.heroDescription || subcategoryData.description}
          </p>
        </div>

        {/* Products Section - Now comes first */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">
            {products.length > 0
              ? `${content?.title || subcategoryData.name} Products`
              : "Products Coming Soon"}
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
                We're currently adding products to this category.
              </p>
              <Link
                href={`/${category}`}
                className="text-primary hover:underline font-medium"
              >
                View all {categoryData.name} →
              </Link>
            </div>
          )}
        </div>

        {/* Additional Info - Below Products */}
        {(content?.features || content?.longDescription || content?.applications) && (
          <div className="mb-10">
            {content?.longDescription && (
              <div className="mb-6 prose prose-neutral dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-3">About {content?.title || subcategoryData.name}</h2>
                <p className="text-base leading-relaxed text-muted-foreground">{content.longDescription}</p>
              </div>
            )}
            {content?.applications && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Applications</h3>
                <div className="flex flex-wrap gap-2">
                  {content.applications.map((app, index) => (
                    <span key={index} className="text-sm bg-muted text-muted-foreground px-3 py-1.5 rounded-md border border-border">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {content?.features && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                <ul className="grid md:grid-cols-2 gap-2">
                  {content.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* FAQs */}
        {content?.faqs && content.faqs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {content.faqs.map((faq, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Need Help Selecting the Right Product?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our technical team can help you find the right {content?.title?.toLowerCase() || subcategoryData.name.toLowerCase()} for your application.
            Call us on <a href="tel:1300271290" className="text-primary hover:underline">1300 271 290</a> or request a quote.
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
