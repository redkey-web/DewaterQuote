import ProductCard from "../ProductCard";
import productImage from "@assets/generated_images/Duckbill_check_valve_product_cb995e5f.png";

export default function ProductCardExample() {
  const sampleProduct = {
    id: "1",
    name: "Duckbill Check Valve DN100",
    sku: "DBV-100-STD",
    price: 245.00,
    image: productImage,
    category: "Check Valves",
    brand: "Straub",
  };

  return (
    <div className="p-8 max-w-sm">
      <ProductCard product={sampleProduct} onAddToQuote={(p) => console.log("Added to quote:", p.name)} />
    </div>
  );
}
