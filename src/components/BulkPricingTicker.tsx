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
        <span className="font-bold text-[#ccff00]" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>5% OFF</span>
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
      <span className="font-bold text-[#ccff00]" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>5%</span>
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
    <div className="ticker-fixed py-2 overflow-hidden">
      {/* Wave Layer 1: Foam bubbles - beach wash effect */}
      <div
        className="absolute inset-0 pointer-events-none animate-ticker-wave-1"
        style={{
          background: 'radial-gradient(circle at 8% 40%, rgba(255,255,255,0.18) 1px, transparent 3px), radial-gradient(circle at 22% 70%, rgba(0,200,200,0.12) 2px, transparent 4px), radial-gradient(circle at 38% 30%, rgba(255,255,255,0.15) 1px, transparent 3px), radial-gradient(circle at 52% 60%, rgba(0,220,220,0.1) 2px, transparent 4px), radial-gradient(circle at 68% 45%, rgba(255,255,255,0.16) 1px, transparent 3px), radial-gradient(circle at 82% 75%, rgba(0,200,200,0.11) 2px, transparent 4px), radial-gradient(circle at 95% 35%, rgba(255,255,255,0.14) 1px, transparent 3px), radial-gradient(ellipse 120% 200% at 30% 150%, rgba(0,180,180,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Wave Layer 2: Medium ripples - mid layer with curves */}
      <div
        className="absolute inset-0 pointer-events-none animate-ticker-wave-2"
        style={{
          background: 'radial-gradient(ellipse 80% 150% at 70% -50%, rgba(0,200,200,0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 120% at 20% 130%, rgba(0,220,220,0.06) 0%, transparent 45%)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Wave Layer 3: Fast shimmer - surface sparkle with horizontal curves */}
      <div
        className="absolute inset-0 pointer-events-none animate-ticker-wave-3"
        style={{
          background: 'radial-gradient(ellipse 40% 100% at 10% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(ellipse 35% 80% at 50% 50%, rgba(0,240,240,0.06) 0%, transparent 45%), radial-gradient(ellipse 45% 90% at 90% 50%, rgba(255,255,255,0.07) 0%, transparent 50%)',
        }}
      />

      {/* Wave Layer 4: Horizontal drift - slow current */}
      <div
        className="absolute inset-0 pointer-events-none animate-ticker-wave-4"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,200,200,0.04) 25%, rgba(255,255,255,0.06) 50%, rgba(0,220,220,0.04) 75%, transparent 100%)',
        }}
      />

      {/* Wave Layer 5: Beach wave wash - gentle wash-out effect */}
      <div
        className="absolute inset-0 pointer-events-none animate-ticker-wave-5"
        style={{
          background: 'linear-gradient(110deg, transparent 20%, rgba(0,200,200,0.08) 35%, rgba(255,255,255,0.12) 50%, rgba(0,180,180,0.06) 65%, transparent 80%), linear-gradient(70deg, transparent 30%, rgba(0,210,210,0.05) 45%, rgba(255,255,255,0.08) 55%, transparent 70%)',
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
