import { Product } from '../app/Types';

export class ProductService {
  // ¡Esta función debe existir y ser static!
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`http://localhost:3001/products?category=${category}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // Otras funciones del servicio...
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`http://localhost:3001/products/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
}