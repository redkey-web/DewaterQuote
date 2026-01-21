'use client'

import { TrendingDown } from "lucide-react"

interface BulkPricingTickerProps {
  variant?: "default" | "teal"
}

// Ticker content
function TickerContent() {
  return (
    <div className="flex items-center gap-12 px-8 text-[14px] font-mono font-normal uppercase opacity-70 ticker-chrome-blink">
      <div className="flex items-center gap-2">
        <TrendingDown className="w-4 h-4 ticker-text-prominent" />
        <span className="ticker-text-prominent">BULK PRICING:</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="ticker-text-prominent">2+ items</span>
        <span className="text-[#ccff00]">5% off</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="ticker-text-prominent">5+ items</span>
        <span className="text-[#ff6600]">10% off</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="ticker-text-prominent">10+ items</span>
        <span className="text-[#E91E63]">15% off</span>
      </div>
      <span className="ticker-text-prominent">•</span>
    </div>
  )
}

export default function BulkPricingTicker({ variant = "default" }: BulkPricingTickerProps) {
  return (
    <div className="ticker-fixed py-2 overflow-hidden relative">
      <div className="ticker-wrapper-seamless relative">
        {/* 6 copies for truly seamless infinite scroll - no gaps */}
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
