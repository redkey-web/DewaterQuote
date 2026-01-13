"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, TrendingDown } from "lucide-react"
import { useGeo } from "@/hooks/useGeo"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

// Brand color configurations
const brandColors: Record<string, { bg: string; text: string; border: string }> = {
  Straub: { bg: "bg-red-600", text: "text-black", border: "border-red-600" },
  Teekay: { bg: "bg-red-600", text: "text-white", border: "border-red-600" },
  Orbit: { bg: "bg-orange-500", text: "text-black", border: "border-orange-500" },
  "Defender Strainers": { bg: "bg-[#E18D30]", text: "text-black", border: "border-[#E18D30]" },
  "Defender Valves": { bg: "bg-[#5E7794]", text: "text-white", border: "border-[#5E7794]" },
  "Dewater Products": { bg: "bg-[#39C5DA]", text: "text-white", border: "border-[#39C5DA]" },
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const mainImage = product.images?.[0]?.url
  const { isAustralia } = useGeo()

  // Check if product has pricing (not POA) - only relevant for AU visitors
  const hasPrice = isAustralia && (product.priceVaries
    ? product.sizeOptions?.some((opt) => opt.price && opt.price > 0)
    : product.price && product.price > 0)

  useEffect(() => {
    setImageError(false)
  }, [mainImage])

  const colors = brandColors[product.brand] || { bg: "bg-gray-600", text: "text-white", border: "border-gray-600" }

  return (
    <Link href={`/${product.slug}`} className="block group" data-testid={`card-product-${product.id}`}>
      <div className="relative">
        {/* Main card with folder shape - 3D paper effect */}
        <div
          className="relative overflow-hidden transition-all duration-300 group-hover:-translate-y-2 folder-card-3d rounded-2xl"
          style={{
            clipPath: 'polygon(0 0, 42% 0, 50% 8%, 100% 8%, 100% 100%, 0 100%)'
          }}
        >
          {/* Discount badge */}
          {hasPrice && (
            <div className="absolute top-3 left-3 z-10 bg-primary/90 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Discounts
            </div>
          )}

          {/* Image container */}
          <div className="aspect-square p-6 flex items-center justify-center relative">
            {mainImage && !imageError ? (
              <Image
                src={mainImage}
                alt={product.name}
                width={400}
                height={400}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                data-testid={`img-product-${product.id}`}
              />
            ) : (
              <Package
                className="w-20 h-20 text-zinc-400"
                data-testid={`icon-placeholder-${product.id}`}
              />
            )}

            {/* Hover text overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="relative font-semibold text-sm tracking-wide uppercase view-product-shimmer">
                View Product
              </span>
            </div>
          </div>

          {/* Brand tab - in folder tab area (top left) */}
          <div className="absolute -top-[20px] left-[calc(4%-41px)]">
            <div
              className={`${colors.bg} ${colors.text} px-8 py-3 rounded-b-xl font-semibold ${product.brand.startsWith('Defender') ? 'text-xs' : 'text-sm'} whitespace-nowrap flex items-center justify-center`}
            >
              <span className="translate-x-[6px] translate-y-[10px]">{product.brand}</span>
            </div>
          </div>

          {/* Product name - bottom with gradient background for readability */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-zinc-800 dark:via-zinc-800/95 pt-8 px-4 pb-3">
            <h3
              className="text-black dark:text-white font-semibold text-sm line-clamp-2"
              data-testid={`text-product-name-${product.id}`}
            >
              {(product.shortName || product.name).replace(new RegExp(`^${product.brand}\\s*`, 'i'), '')}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  )
}
