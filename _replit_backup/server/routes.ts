import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { netoAPI } from "./neto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Neto product API routes
  app.get("/api/neto/products/search", async (req, res) => {
    try {
      const { name, sku, brand, model } = req.query;
      
      const products = await netoAPI.getProducts({
        Name: name as string,
        SKU: sku as string,
        Brand: brand as string,
        Model: model as string,
        Limit: 50
      });

      res.json(products);
    } catch (error) {
      console.error("Error fetching Neto products:", error);
      res.status(500).json({ 
        message: "Failed to fetch products from Neto",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.get("/api/neto/products/sku/:sku", async (req, res) => {
    try {
      const product = await netoAPI.getProductBySKU(req.params.sku);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching Neto product:", error);
      res.status(500).json({ 
        message: "Failed to fetch product from Neto",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
