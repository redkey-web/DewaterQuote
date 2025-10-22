import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AnnouncementBanner from "@/components/AnnouncementBanner";
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

  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AnnouncementBanner />
          <div className="flex items-center gap-4 px-6 py-2 border-b border-border bg-background sticky top-0 z-40">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex-1" />
          </div>
          <Header cartItemCount={quoteItems.length} onCartClick={() => setIsCartOpen(true)} />
          <main className="flex-1 overflow-auto">
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
        </div>
        <QuoteCart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={quoteItems}
          onRemoveItem={handleRemoveItem}
          onSubmitQuote={handleSubmitQuote}
        />
        <StickyQuoteButton itemCount={quoteItems.length} onClick={() => setIsCartOpen(true)} />
      </div>
    </SidebarProvider>
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
