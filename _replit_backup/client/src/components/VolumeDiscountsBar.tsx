import { TrendingDown, Truck } from "lucide-react";

export function VolumeDiscountsBar() {
  return (
    <section className="relative z-20 py-3 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto overflow-hidden relative">
        <style>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          @keyframes flash-teal {
            0%, 100% {
              color: white;
              text-shadow: 0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6);
            }
            50% {
              color: #7FF3FF;
              text-shadow: 0 0 2px black, 0 0 2px black, 0 0 2px black;
            }
          }
          .volume-discount-scroll {
            animation: scroll-left 39s linear infinite;
          }
          .volume-discount-scroll:hover {
            animation-play-state: paused;
          }
          .flash-delivery {
            animation: flash-teal 1s ease-in-out infinite;
          }
        `}</style>
        <div className="flex items-center gap-4 text-sm font-medium text-foreground whitespace-nowrap">
          <div className="volume-discount-scroll flex items-center gap-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 flex-shrink-0" style={{ color: '#7FF3FF', filter: 'drop-shadow(0 0 2px black) drop-shadow(0 0 2px black)' }} />
              <span className="font-bold" style={{ color: '#7FF3FF', textShadow: '0 0 2px black, 0 0 2px black, 0 0 2px black' }}>Volume Discounts:</span>
            </div>
            <span className="text-white font-bold" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>2-4 items: <span className="text-red-400 dark:text-red-300">5%</span> OFF</span>
            <span className="text-white" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>•</span>
            <span className="text-white font-bold" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>5-9 items: <span className="text-red-400 dark:text-red-300">10%</span> OFF</span>
            <span className="text-white" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>•</span>
            <span className="text-white font-bold" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>10+ items: <span className="text-red-400 dark:text-red-300">15%</span> OFF</span>
            <span className="mx-8 text-white" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>✦</span>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 flex-shrink-0" style={{ color: '#7FF3FF', filter: 'drop-shadow(0 0 2px black) drop-shadow(0 0 2px black)' }} />
              <span className="font-bold flash-delivery">FREE DELIVERY across Australia</span>
            </div>
            <span className="mx-8 text-white" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>✦</span>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 flex-shrink-0" style={{ color: '#7FF3FF', filter: 'drop-shadow(0 0 2px black) drop-shadow(0 0 2px black)' }} />
              <span className="font-bold" style={{ color: '#7FF3FF', textShadow: '0 0 2px black, 0 0 2px black, 0 0 2px black' }}>Volume Discounts:</span>
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-bold">2-4 items: <span className="text-red-400 dark:text-red-300">5%</span> <span className="text-white" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>OFF</span></span>
            <span className="text-gray-700 dark:text-gray-300">•</span>
            <span className="text-gray-700 dark:text-gray-300 font-bold">5-9 items: <span className="text-red-400 dark:text-red-300">10%</span> <span className="text-white" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>OFF</span></span>
            <span className="text-gray-700 dark:text-gray-300">•</span>
            <span className="text-gray-700 dark:text-gray-300 font-bold">10+ items: <span className="text-red-400 dark:text-red-300">15%</span> <span className="text-white" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>OFF</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
