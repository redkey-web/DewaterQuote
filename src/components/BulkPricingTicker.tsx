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
        <span className="font-bold text-[#ff3333]" style={{ textShadow: 'none' }}>15% OFF</span>
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
      <span className="font-bold text-[#ccff00]" style={{ textShadow: 'none' }}>5%</span>
      <span className="ticker-text-prominent">•</span>
      <span className="font-bold text-[#ff6600]" style={{ textShadow: 'none' }}>10%</span>
      <span className="ticker-text-prominent">•</span>
      <span className="font-bold text-[#ff3333]" style={{ textShadow: 'none' }}>15%</span>
      <span className="ticker-text-prominent">•</span>
    </div>
  )
}

export default function BulkPricingTicker({ variant = "default", isStormyDay = false }: BulkPricingTickerProps) {
  const Content = isStormyDay ? StormyTickerContent : TickerContent

  return (
    <div className="sticky top-[88px] z-40 py-2 overflow-hidden relative">
      {/* Gradient blur background - bottom heavy */}
      <div
        className="absolute inset-0 pointer-events-none animate-ticker-gradient-float"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.15) 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
        }}
      />
      {/* Opposite gradient - top heavy, animated, aqua tint */}
      <div
        className="absolute inset-0 pointer-events-none animate-ticker-gradient-float"
        style={{
          background: 'linear-gradient(to top, rgba(0,200,200,0.02) 0%, rgba(0,220,220,0.06) 50%, rgba(0,240,240,0.12) 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          maskImage: 'linear-gradient(to top, transparent 0%, black 30%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 30%, black 100%)',
        }}
      />
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
