"use client"

import { ShoppingCart } from "lucide-react"
import { useQuote } from "@/context/QuoteContext"

export default function StickyQuoteButton() {
  const { itemCount, openCart } = useQuote()

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 border border-cyan-600 animate-press-bounce bg-[radial-gradient(ellipse_at_center,_rgba(90,235,250,0.8)_0%,_rgba(56,220,235,0.85)_60%,_rgba(34,200,220,0.9)_100%)] text-gray-800 shadow-[0_4px_15px_rgba(0,0,0,0.2),inset_0_0_4px_rgba(0,0,0,0.15),inset_0_0_2px_1px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.4)] hover:bg-[radial-gradient(ellipse_at_center,_rgba(103,232,249,0.9)_0%,_rgba(34,211,238,0.9)_50%,_rgba(20,184,198,0.95)_100%)] hover:border-cyan-400 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25),inset_0_0_15px_rgba(255,255,255,0.5),inset_0_0_25px_rgba(255,255,255,0.3),inset_0_1px_0_rgba(255,255,255,0.8)] hover:[text-shadow:0_0_8px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.3)] active:shadow-[inset_0_3px_8px_rgba(0,0,0,0.4)] relative"
        onClick={openCart}
        data-testid="button-sticky-quote"
      >
        <ShoppingCart className="w-5 h-5" />
        View Quote ({itemCount})
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  )
}
