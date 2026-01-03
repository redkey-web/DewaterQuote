import { TrendingDown } from "lucide-react"

export default function BulkPricingTicker() {
  return (
    <div className="sticky top-[90px] z-40 bg-primary/90 backdrop-blur-sm py-2 overflow-hidden">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          <div className="flex items-center gap-8 px-8 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-white" />
              <span className="font-semibold text-white">Bulk Pricing:</span>
              <span className="text-white/80">Buy 2-4</span>
              <span className="font-bold text-yellow-400">5% OFF</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80">Buy 5-9</span>
              <span className="font-bold text-orange-400">10% OFF</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80">Buy 10+</span>
              <span className="font-bold text-rose-400">15% OFF</span>
            </div>
            <span className="text-white/50">•</span>
          </div>
        </div>
        <div className="ticker-content" aria-hidden="true">
          <div className="flex items-center gap-8 px-8 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-white" />
              <span className="font-semibold text-white">Bulk Pricing:</span>
              <span className="text-white/80">Buy 2-4</span>
              <span className="font-bold text-yellow-400">5% OFF</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80">Buy 5-9</span>
              <span className="font-bold text-orange-400">10% OFF</span>
            </div>
            <span className="text-white/50">•</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80">Buy 10+</span>
              <span className="font-bold text-rose-400">15% OFF</span>
            </div>
            <span className="text-white/50">•</span>
          </div>
        </div>
      </div>
    </div>
  )
}
