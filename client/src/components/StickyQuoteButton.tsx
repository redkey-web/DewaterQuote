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
      <Button
        size="lg"
        className="shadow-xl relative"
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
