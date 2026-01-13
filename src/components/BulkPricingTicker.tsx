'use client'

import { TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

interface BulkPricingTickerProps {
  variant?: "default" | "teal"
}

export default function BulkPricingTicker({ variant = "default" }: BulkPricingTickerProps) {
  const [isBelowHero, setIsBelowHero] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Hero section is approximately 600-700px tall
          // Trigger when scrolled past about 500px
          setIsBelowHero(window.scrollY > 500)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const bgClass = isBelowHero ? "bg-gray-700/20" : "bg-gray-600/20"

  return (
    <div className={`sticky top-[88px] z-40 ${bgClass} py-2 overflow-hidden transition-colors duration-300`}>
      <div className="ticker-wrapper">
        <div className="ticker-content">
          <div className="flex items-center gap-8 px-8 text-sm text-white">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              <span className="font-semibold">Bulk Pricing:</span>
              <span>Buy 2-4</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">5% OFF</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>Buy 5-9</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">10% OFF</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>Buy 10+</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">15% OFF</span>
            </div>
            <span>•</span>
          </div>
        </div>
        <div className="ticker-content" aria-hidden="true">
          <div className="flex items-center gap-8 px-8 text-sm text-white">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              <span className="font-semibold">Bulk Pricing:</span>
              <span>Buy 2-4</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">5% OFF</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>Buy 5-9</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">10% OFF</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>Buy 10+</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">15% OFF</span>
            </div>
            <span>•</span>
          </div>
        </div>
      </div>
    </div>
  )
}
