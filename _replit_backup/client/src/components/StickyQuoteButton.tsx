import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface StickyQuoteButtonProps {
  itemCount: number;
  onClick: () => void;
}

export default function StickyQuoteButton({ itemCount, onClick }: StickyQuoteButtonProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <style>{`
        @keyframes water-flow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        .water-ripple-button {
          background: linear-gradient(
            90deg,
            #14555F 0%,
            #1F7A8A 20%,
            #2B9CAF 40%,
            #39C2D9 60%,
            #2B9CAF 80%,
            #1F7A8A 90%,
            #14555F 100%
          );
          background-size: 200% 100%;
          animation: water-flow 4s linear infinite;
        }
      `}</style>
      <Button
        size="lg"
        className="shadow-xl relative water-ripple-button text-gray-200"
        onClick={onClick}
        data-testid="button-sticky-quote"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        View Quote ({itemCount})
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
    </div>
  );
}
