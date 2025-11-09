import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Trash2, Send } from "lucide-react";
import { getQuoteItemPrice, getQuoteItemSKU, getQuoteItemSizeLabel, getQuoteItemSubtotal } from "@/lib/quote";
import type { QuoteItem } from "@shared/schema";

interface QuoteCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onRemoveItem?: (itemId: string) => void;
  onSubmitQuote?: () => void;
}

export default function QuoteCart({ isOpen, onClose, items, onRemoveItem, onSubmitQuote }: QuoteCartProps) {
  const pricedItems = items.filter((item) => getQuoteItemPrice(item) !== undefined);
  const unpricedItems = items.filter((item) => getQuoteItemPrice(item) === undefined);
  const subtotal = pricedItems.reduce((sum, item) => sum + (getQuoteItemSubtotal(item) || 0), 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} data-testid="overlay-quote-cart" />
      <div className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-background border-l border-border shadow-xl z-50 flex flex-col" data-testid="panel-quote-cart">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quote Request</h2>
            <p className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? 's' : ''} added</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-cart">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your quote is empty</p>
              <p className="text-sm text-muted-foreground mt-2">Add products to request a quote</p>
            </div>
          ) : (
            <>
              {pricedItems.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Items with Pricing</h3>
                  <div className="space-y-3">
                    {pricedItems.map((item) => {
                      const price = getQuoteItemPrice(item);
                      const sku = getQuoteItemSKU(item);
                      const sizeLabel = getQuoteItemSizeLabel(item);
                      const itemSubtotal = getQuoteItemSubtotal(item);
                      
                      return (
                        <div key={item.id} className="flex gap-4 p-4 bg-card border border-card-border rounded-md" data-testid={`quote-item-${item.id}`}>
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            {sizeLabel && (
                              <p className="text-xs text-muted-foreground">Size: {sizeLabel}</p>
                            )}
                            <p className="text-xs text-muted-foreground font-mono">{sku}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm font-bold text-primary">${price?.toFixed(2)}</p>
                              {item.quantity > 1 && (
                                <>
                                  <span className="text-xs text-muted-foreground">×</span>
                                  <Badge variant="secondary" className="text-xs">{item.quantity}</Badge>
                                  <span className="text-xs text-muted-foreground">=</span>
                                  <p className="text-sm font-semibold">${itemSubtotal?.toFixed(2)}</p>
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveItem?.(item.id)}
                            className="shrink-0"
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Subtotal:</span>
                      <span className="text-xl font-bold text-primary" data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {unpricedItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold">Prices to be Confirmed</h3>
                    <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">Upon Enquiry</Badge>
                  </div>
                  <div className="space-y-3">
                    {unpricedItems.map((item) => {
                      const sku = getQuoteItemSKU(item);
                      const sizeLabel = getQuoteItemSizeLabel(item);
                      
                      return (
                        <div key={item.id} className="flex gap-4 p-4 bg-card border border-card-border rounded-md" data-testid={`quote-item-${item.id}`}>
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            {sizeLabel && (
                              <p className="text-xs text-muted-foreground">Size: {sizeLabel}</p>
                            )}
                            <p className="text-xs text-muted-foreground font-mono">{sku}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-chart-3 font-medium">Price on request</p>
                              {item.quantity > 1 && (
                                <>
                                  <span className="text-xs text-muted-foreground">×</span>
                                  <Badge variant="secondary" className="text-xs">{item.quantity}</Badge>
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveItem?.(item.id)}
                            className="shrink-0"
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-3">
            <Button className="w-full" size="lg" onClick={onSubmitQuote} data-testid="button-submit-quote">
              <Send className="w-4 h-4 mr-2" />
              Submit Quote Request
            </Button>
            <Button variant="outline" className="w-full" onClick={onClose} data-testid="button-continue-browsing">
              Continue Browsing
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
