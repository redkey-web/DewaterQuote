import { TrendingDown } from "lucide-react"

interface BulkPricingTickerProps {
  variant?: "default" | "teal"
}

export default function BulkPricingTicker({ variant = "default" }: BulkPricingTickerProps) {
  const bgClass = variant === "teal" ? "bg-primary/10" : "bg-gray-100"

  return (
    <div className={`sticky top-[88px] z-40 ${bgClass} py-2 overflow-hidden`}>
      <div className="ticker-wrapper">
        <div className="ticker-content">
          <div className="flex items-center gap-8 px-8 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-gray-300" />
              <span className="font-semibold text-gray-300">Bulk Pricing:</span>
              <span className="text-gray-300">Buy 2-4</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">5% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Buy 5-9</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">10% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Buy 10+</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">15% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
          </div>
        </div>
        <div className="ticker-content" aria-hidden="true">
          <div className="flex items-center gap-8 px-8 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-gray-300" />
              <span className="font-semibold text-gray-300">Bulk Pricing:</span>
              <span className="text-gray-300">Buy 2-4</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">5% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Buy 5-9</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">10% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Buy 10+</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">15% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
          </div>
        </div>
      </div>
    </div>
  )
}
