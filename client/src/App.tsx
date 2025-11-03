import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteCart from "@/components/QuoteCart";
import StickyQuoteButton from "@/components/StickyQuoteButton";
import HomePage from "@/pages/HomePage";
import ProductListPage from "@/pages/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ContactPage from "@/pages/ContactPage";
import ClampsCouplingsPage from "@/pages/ClampsCouplingsPage";
import ValvesPage from "@/pages/ValvesPage";
import ExpansionJointsPage from "@/pages/ExpansionJointsPage";
import StrainersPage from "@/pages/StrainersPage";
import BrandPage from "@/pages/BrandPage";
import IndustryPage from "@/pages/IndustryPage";
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
      <AnnouncementBanner />
      <Header cartItemCount={quoteItems.length} onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          
          {/* Product Detail Pages */}
          <Route path="/products/:slug">
            <ProductDetailPage onAddToQuote={handleAddToQuote} />
          </Route>

          {/* Main Category Pages */}
          <Route path="/pipe-couplings">
            <ClampsCouplingsPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/pipe-repair-clamps">
            <ClampsCouplingsPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/valves">
            <ValvesPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/rubber-expansion-joints">
            <ExpansionJointsPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/strainers">
            <StrainersPage onAddToQuote={handleAddToQuote} />
          </Route>

          {/* Subcategory Pages - All use ProductListPage */}
          <Route path="/pipe-couplings/:subcategory">
            <ProductListPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/pipe-repair-clamps/:subcategory">
            <ProductListPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/valves/:subcategory">
            <ProductListPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/valves/check-valves/:type">
            <ProductListPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/rubber-expansion-joints/:subcategory">
            <ProductListPage onAddToQuote={handleAddToQuote} />
          </Route>
          <Route path="/strainers/:subcategory">
            <ProductListPage onAddToQuote={handleAddToQuote} />
          </Route>

          {/* Brand Pages */}
          <Route path="/brands/straub">
            <BrandPage 
              brandName="Straub" 
              description="German engineering excellence in pipe couplings and repair solutions. Straub provides reliable, high-quality pipe connection systems trusted worldwide."
              onAddToQuote={handleAddToQuote} 
            />
          </Route>
          <Route path="/brands/orbit">
            <BrandPage 
              brandName="Orbit" 
              description="Premium valves and fittings for demanding industrial applications. Orbit delivers precision-engineered solutions for critical flow control needs."
              onAddToQuote={handleAddToQuote} 
            />
          </Route>
          <Route path="/brands/teekay">
            <BrandPage 
              brandName="Teekay" 
              description="Innovative expansion joints and flexible connectors. Teekay specialises in thermal expansion solutions for piping systems."
              onAddToQuote={handleAddToQuote} 
            />
          </Route>

          {/* Industry Pages */}
          <Route path="/industries/water-wastewater">
            <IndustryPage 
              industryName="Water & Wastewater"
              description="Reliable solutions for water treatment, distribution, and wastewater management systems. Our products are designed to meet the demanding requirements of municipal and industrial water infrastructure."
              applications={["Water treatment plants", "Distribution networks", "Wastewater treatment", "Pumping stations", "Storage facilities"]}
              onAddToQuote={handleAddToQuote}
            />
          </Route>
          <Route path="/industries/irrigation">
            <IndustryPage 
              industryName="Irrigation"
              description="Efficient systems for agricultural and landscape irrigation applications. Designed for durability and optimal water distribution in farming and horticulture."
              applications={["Agricultural irrigation", "Drip systems", "Sprinkler networks", "Water conservation systems", "Greenhouse applications"]}
              onAddToQuote={handleAddToQuote}
            />
          </Route>
          <Route path="/industries/fire-services">
            <IndustryPage 
              industryName="Fire Services"
              description="Critical components for fire protection and suppression systems. Certified products meeting stringent safety standards for fire service applications."
              applications={["Fire sprinkler systems", "Fire hydrant networks", "Fire pump installations", "Emergency water supply", "Fire protection mains"]}
              onAddToQuote={handleAddToQuote}
            />
          </Route>
          <Route path="/industries/mining">
            <IndustryPage 
              industryName="Mining"
              description="Robust fittings engineered for harsh mining environments. Heavy-duty solutions capable of withstanding extreme conditions and abrasive materials."
              applications={["Dewatering systems", "Slurry transport", "Tailings management", "Mine water supply", "Dust suppression"]}
              onAddToQuote={handleAddToQuote}
            />
          </Route>
          <Route path="/industries/marine">
            <IndustryPage 
              industryName="Marine"
              description="Corrosion-resistant solutions for marine and coastal applications. Products designed to withstand saltwater environments and maritime conditions."
              applications={["Shipboard piping", "Port facilities", "Offshore platforms", "Desalination plants", "Coastal infrastructure"]}
              onAddToQuote={handleAddToQuote}
            />
          </Route>
          <Route path="/industries/hvac">
            <IndustryPage 
              industryName="HVAC"
              description="Flexible connections and fittings for heating, ventilation, and air conditioning systems. Solutions for thermal expansion and vibration isolation."
              applications={["Chiller connections", "Boiler systems", "Air handling units", "Cooling towers", "HVAC distribution"]}
              onAddToQuote={handleAddToQuote}
            />
          </Route>
          <Route path="/industries/food-beverage">
            <IndustryPage 
              industryName="Food & Beverage"
              description="Hygienic pipe connections for food processing and beverage production. Compliant with food safety standards and easy to clean."
              applications={["Food processing", "Beverage production", "Dairy facilities", "Brewery systems", "Clean-in-place (CIP) systems"]}
              onAddToQuote={handleAddToQuote}
            />
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
