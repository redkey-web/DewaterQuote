import { TrendingDown } from "lucide-react"

interface BulkPricingTickerProps {
  variant?: "default" | "teal"
}

export default function BulkPricingTicker({ variant = "default" }: BulkPricingTickerProps) {
  const bgClass = variant === "teal" ? "bg-primary/10" : "bg-gray-100"

  return (
    <div className={`sticky top-[103px] z-40 ${bgClass} py-2 overflow-hidden`}>
      <div className="ticker-wrapper">
        <div className="ticker-content">
          <div className="flex items-center gap-8 px-8 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-gray-700" />
              <span className="font-semibold text-gray-800">Bulk Pricing:</span>
              <span className="text-gray-600">Buy 2-4</span>
              <span className="font-bold text-yellow-600">5% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Buy 5-9</span>
              <span className="font-bold text-orange-600">10% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Buy 10+</span>
              <span className="font-bold text-rose-600">15% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
          </div>
        </div>
        <div className="ticker-content" aria-hidden="true">
          <div className="flex items-center gap-8 px-8 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-gray-700" />
              <span className="font-semibold text-gray-800">Bulk Pricing:</span>
              <span className="text-gray-600">Buy 2-4</span>
              <span className="font-bold text-yellow-600">5% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Buy 5-9</span>
              <span className="font-bold text-orange-600">10% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Buy 10+</span>
              <span className="font-bold text-rose-600">15% OFF</span>
            </div>
            <span className="text-gray-400">•</span>
          </div>
        </div>
      </div>
    </div>
  )
}
