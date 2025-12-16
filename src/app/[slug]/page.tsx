import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getProductBySlug, getProductsBySubcategory, getAllProductSlugs } from "@/data/products"
import { ProductDetailClient } from "@/components/ProductDetailClient"

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all products
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: "Product Not Found | Dewater Products" }
  }

  const primaryImage = product.images[0]?.url || "/og-default.jpg"

  return {
    title: `${product.name} | Dewater Products`,
    description: product.description.slice(0, 160),
    keywords: [product.brand, product.category, ...(product.applications || [])],
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: primaryImage, width: 1200, height: 630, alt: product.name }],
      type: "website",
      locale: "en_AU",
      siteName: "Dewater Products",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: [primaryImage],
    },
    alternates: {
      canonical: `https://dewaterproducts.com.au/${product.slug}`,
    },
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Get related products from the same subcategory
  const relatedProducts = product.subcategory
    ? (await getProductsBySubcategory(product.category, product.subcategory))
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : []

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}
