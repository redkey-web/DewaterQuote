'use client'

import { TrendingDown } from "lucide-react"

interface BulkPricingTickerProps {
  variant?: "default" | "teal"
}

export default function BulkPricingTicker({ variant = "default" }: BulkPricingTickerProps) {

  return (
    <div className="sticky top-[88px] z-40 py-2 overflow-hidden">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          <div className="flex items-center gap-8 px-8 text-sm text-[#678a94]" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.2)' }}>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              <span className="font-semibold">Bulk Pricing:</span>
              <span>Buy 2-4</span>
              <span className="font-bold miami-gradient-text">5% OFF</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>Buy 5-9</span>
              <span className="font-bold miami-gradient-text">10% OFF</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>Buy 10+</span>
              <span className="font-bold miami-gradient-text">15% OFF</span>
            </div>
            <span>•</span>
          </div>
        </div>
        <div className="ticker-content" aria-hidden="true">
          <div className="flex items-center gap-8 px-8 text-sm text-[#678a94]" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.2)' }}>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              <span className="font-semibold">Bulk Pricing:</span>
              <span>Buy 2-4</span>
              <span className="font-bold miami-gradient-text">5% OFF</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>Buy 5-9</span>
              <span className="font-bold miami-gradient-text">10% OFF</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>Buy 10+</span>
              <span className="font-bold miami-gradient-text">15% OFF</span>
            </div>
            <span>•</span>
          </div>
        </div>
      </div>
    </div>
  )
}
