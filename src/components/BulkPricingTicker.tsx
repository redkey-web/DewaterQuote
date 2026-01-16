'use client'

import { TrendingDown } from "lucide-react"

interface BulkPricingTickerProps {
  variant?: "default" | "teal"
  isStormyDay?: boolean
}

// Normal ticker content
function TickerContent() {
  return (
    <div className="flex items-center gap-8 px-8 text-base font-medium ticker-chrome-blink">
      <div className="flex items-center gap-2">
        <TrendingDown className="w-4 h-4 ticker-text-prominent" />
        <span className="font-semibold ticker-text-prominent">BULK PRICING:</span>
        <span className="ticker-text-prominent">Buy 2-4</span>
        <span className="font-bold text-[#ccff00]" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.6)' }}>5% OFF</span>
      </div>
      <span className="ticker-text-prominent">•</span>
      <div className="flex items-center gap-2">
        <span className="ticker-text-prominent">Buy 5-9</span>
        <span className="font-bold text-[#ff6600]" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.6)' }}>10% OFF</span>
      </div>
      <span className="ticker-text-prominent">•</span>
      <div className="flex items-center gap-2">
        <span className="ticker-text-prominent">Buy 10+</span>
        <span className="font-bold text-[#E91E63]" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.6)' }}>15% OFF</span>
      </div>
      <span className="ticker-text-prominent">•</span>
      <div className="flex items-center gap-2">
        <span className="ticker-text-prominent text-[14px]">MIX ANY PRODUCTS - DISCOUNTS APPLY TO <span className="italic">TOTAL QUANTITY!</span></span>
      </div>
      <span className="ticker-text-prominent">•</span>
    </div>
  )
}

// Stormy day ticker - numbers only
function StormyTickerContent() {
  return (
    <div className="flex items-center gap-12 px-8 text-base font-medium ticker-chrome-blink">
      <span className="font-bold text-[#ccff00]" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.6)' }}>5%</span>
      <span className="ticker-text-prominent">•</span>
      <span className="font-bold text-[#ff6600]" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.6)' }}>10%</span>
      <span className="ticker-text-prominent">•</span>
      <span className="font-bold text-[#E91E63]" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.6)' }}>15%</span>
      <span className="ticker-text-prominent">•</span>
    </div>
  )
}

export default function BulkPricingTicker({ variant = "default", isStormyDay = false }: BulkPricingTickerProps) {
  const Content = isStormyDay ? StormyTickerContent : TickerContent

  return (
    <div className="ticker-fixed py-2 overflow-hidden">
      <div className="ticker-wrapper-seamless relative">
        {/* 6 copies for truly seamless infinite scroll - no gaps */}
        <div className="ticker-content">
          <Content />
        </div>
        <div className="ticker-content" aria-hidden="true">
          <Content />
        </div>
        <div className="ticker-content" aria-hidden="true">
          <Content />
        </div>
        <div className="ticker-content" aria-hidden="true">
          <Content />
        </div>
        <div className="ticker-content" aria-hidden="true">
          <Content />
        </div>
        <div className="ticker-content" aria-hidden="true">
          <Content />
        </div>
      </div>
    </div>
  )
}
