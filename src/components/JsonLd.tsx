import type { Product } from "@/types"

interface OrganizationJsonLdProps {
  url?: string
}

export function OrganizationJsonLd({ url = "https://dewaterproducts.com.au" }: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dewater Products",
    url,
    logo: `${url}/images/logo.png`,
    description:
      "Premium industrial pipe fittings, valves, couplings, and expansion joints. Trusted supplier across Australia.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Perth",
      addressRegion: "WA",
      addressCountry: "AU",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+61-1300-271-290",
      contactType: "sales",
      email: "sales@dewaterproducts.com.au",
      areaServed: "AU",
      availableLanguage: "English",
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ProductJsonLdProps {
  product: Product
  url: string
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  // Get price range for products with size options
  let lowPrice: number | undefined
  let highPrice: number | undefined

  if (product.priceVaries && product.sizeOptions) {
    const prices = product.sizeOptions
      .map((opt) => opt.price)
      .filter((p): p is number => typeof p === "number" && p > 0)
    if (prices.length > 0) {
      lowPrice = Math.min(...prices)
      highPrice = Math.max(...prices)
    }
  } else if (product.price && product.price > 0) {
    lowPrice = product.price
    highPrice = product.price
  }

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    image: product.images[0]?.url,
    url,
    category: product.category,
  }

  // Only add offers if we have pricing
  if (lowPrice !== undefined) {
    if (lowPrice === highPrice) {
      jsonLd.offers = {
        "@type": "Offer",
        price: lowPrice,
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      }
    } else {
      jsonLd.offers = {
        "@type": "AggregateOffer",
        lowPrice,
        highPrice,
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
