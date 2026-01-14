'use client'

import { TrendingDown } from "lucide-react"

interface BulkPricingTickerProps {
  variant?: "default" | "teal"
}

// Ticker content component to avoid repetition
function TickerContent() {
  return (
    <div className="flex items-center gap-8 px-8 text-base font-medium ticker-chrome-blink">
      <div className="flex items-center gap-2">
        <TrendingDown className="w-4 h-4 ticker-text-prominent" />
        <span className="font-semibold ticker-text-prominent">BULK PRICING:</span>
        <span className="ticker-text-prominent">Buy 2-4</span>
        <span className="font-bold text-[#ccff00]" style={{ textShadow: 'none' }}>5% OFF</span>
      </div>
      <span className="ticker-text-prominent">•</span>
      <div className="flex items-center gap-2">
        <span className="ticker-text-prominent">Buy 5-9</span>
        <span className="font-bold text-[#ff6600]" style={{ textShadow: 'none' }}>10% OFF</span>
      </div>
      <span className="ticker-text-prominent">•</span>
      <div className="flex items-center gap-2">
        <span className="ticker-text-prominent">Buy 10+</span>
        <span className="font-bold text-[#dc2626]" style={{ textShadow: 'none' }}>15% OFF</span>
      </div>
      <span className="ticker-text-prominent">•</span>
    </div>
  )
}

export default function BulkPricingTicker({ variant = "default" }: BulkPricingTickerProps) {

  return (
    <div className="sticky top-[88px] z-40 py-2 overflow-hidden">
      {/* SVG filter for bulge effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="bulge">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur" />
            <feDisplacementMap in="blur" in2="blur" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div className="ticker-wrapper-seamless ticker-bulge-filter">
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
