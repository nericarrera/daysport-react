import { Product } from '../app/types/product';

// IMPORTANTE: Ahora usamos rutas relativas (/api/...) porque el proxy se encarga
const API_BASE_URL = ''; // ← Vacío porque usamos proxy

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log('🔄 Fetching products for:', category);
      
      const response = await fetch(`/api/products?category=${category}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Products received:', data);
      
      return data.products || data || [];
      
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return [];
    }
  }

  static async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
}