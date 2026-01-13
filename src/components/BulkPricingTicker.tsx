'use client'

import { TrendingDown } from "lucide-react"

interface BulkPricingTickerProps {
  variant?: "default" | "teal"
}

// Ticker content component to avoid repetition
function TickerContent() {
  return (
    <div className="flex items-center gap-8 px-8 text-sm font-medium ticker-chrome-blink">
      <div className="flex items-center gap-2">
        <TrendingDown className="w-4 h-4" />
        <span className="font-semibold">Bulk Pricing:</span>
        <span>Buy 2-4</span>
        <span className="font-bold text-[#ccff00]" style={{ textShadow: '0 0 2px rgba(0,0,0,0.3)' }}>5% OFF</span>
      </div>
      <span>•</span>
      <div className="flex items-center gap-2">
        <span>Buy 5-9</span>
        <span className="font-bold text-[#ff6600]">10% OFF</span>
      </div>
      <span>•</span>
      <div className="flex items-center gap-2">
        <span>Buy 10+</span>
        <span className="font-bold text-[#dc2626]">15% OFF</span>
      </div>
      <span>•</span>
    </div>
  )
}

export default function BulkPricingTicker({ variant = "default" }: BulkPricingTickerProps) {

  return (
    <div className="sticky top-[88px] z-40 py-2 overflow-hidden bg-[#678a94]/40">
      <div className="ticker-wrapper-seamless">
        {/* 4 copies for truly seamless infinite scroll */}
        <div className="ticker-content">
          <TickerContent />
        </div>
        <div className="ticker-content" aria-hidden="true">
          <TickerContent />
        </div>
        <div className="ticker-content" aria-hidden="true">
          <TickerContent />
        </div>
        <div className="ticker-content" aria-hidden="true">
          <TickerContent />
        </div>
      </div>
    </div>
  )
}
