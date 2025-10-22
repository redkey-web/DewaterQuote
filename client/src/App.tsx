import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteCart from "@/components/QuoteCart";
import StickyQuoteButton from "@/components/StickyQuoteButton";
import HomePage from "@/pages/HomePage";
import ProductListPage from "@/pages/ProductListPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/not-found";
import type { Product } from "@/components/ProductCard";

function Router() {
  const [quoteItems, setQuoteItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToQuote = (product: Product) => {
    const exists = quoteItems.find((item) => item.id === product.id);
    if (!exists) {
      setQuoteItems([...quoteItems, product]);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setQuoteItems(quoteItems.filter((item) => item.id !== productId));
  };

  const handleSubmitQuote = () => {
    console.log("Submitting quote with items:", quoteItems);
    setIsCartOpen(false);
    window.location.href = "/contact";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={quoteItems.length} onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/valves/check-valves/duckbill">
            <ProductListPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/contact" component={ContactPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <QuoteCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={quoteItems}
        onRemoveItem={handleRemoveItem}
        onSubmitQuote={handleSubmitQuote}
      />
      <StickyQuoteButton itemCount={quoteItems.length} onClick={() => setIsCartOpen(true)} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
