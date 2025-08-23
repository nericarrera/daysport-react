import { Product } from "../../types/product";

export const ProductService = {
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const res = await fetch(`/api/products?category=${category}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Error al obtener productos");
      return res.json();
    } catch (err) {
      console.error("Error en ProductService.getProductsByCategory:", err);
      return [];
    }
  },

  async getProductById(id: number): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Producto no encontrado");
      return res.json();
    } catch (err) {
      console.error("Error en ProductService.getProductById:", err);
      return null;
    }
  },
};