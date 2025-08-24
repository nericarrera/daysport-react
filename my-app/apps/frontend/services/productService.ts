import { Product } from '../app/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Si tu backend devuelve { products: [], total, etc } o directamente el array
      return data.products || data || [];
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return []; // Retorna array vacío en lugar de mock
    }
  }

  // Otros métodos que necesites...
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
}