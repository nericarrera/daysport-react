import { Product } from '../app/types/product';

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      // AGREGAR la URL completa
      const response = await fetch(`http://localhost:3000/api/products?category=${category}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  static async getProductById(id: number): Promise<Product | null> {
    try {
      // AGREGAR la URL completa  
      const response = await fetch(`http://localhost:3000/api/products/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
}