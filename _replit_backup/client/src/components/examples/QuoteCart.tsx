import { useState } from "react";
import QuoteCart from "../QuoteCart";
import { Button } from "@/components/ui/button";
import productImage1 from "@assets/generated_images/Duckbill_check_valve_product_cb995e5f.png";
import productImage2 from "@assets/generated_images/Pipe_coupling_product_shot_53e8a7d5.png";

export default function QuoteCartExample() {
  const [isOpen, setIsOpen] = useState(true);

  const sampleItems = [
    {
      id: "1",
      name: "Duckbill Check Valve DN100",
      sku: "DBV-100-STD",
      price: 245.00,
      image: productImage1,
      category: "Check Valves",
      brand: "Straub",
    },
    {
      id: "2",
      name: "Stainless Steel Coupling DN150",
      sku: "SSC-150-HD",
      image: productImage2,
      category: "Pipe Couplings",
      brand: "Orbit",
    },
  ];

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>Open Quote Cart</Button>
      <QuoteCart
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={sampleItems}
        onRemoveItem={(id) => console.log("Remove item:", id)}
        onSubmitQuote={() => console.log("Submit quote")}
      />
    </div>
  );
}
