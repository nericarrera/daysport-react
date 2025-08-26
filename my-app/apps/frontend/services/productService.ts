import { Product } from '../app/types/product';

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log('🔄 Fetching products for:', category);
      
      // Usa URL absoluta para evitar conflictos
      const response = await fetch(`http://localhost:3001/api/products?category=${category}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        // cache: 'no-store' // Para desarrollo
      });
      
      if (!response.ok) {
        console.warn('⚠️ Backend not ready, using empty data');
        return [];
      }

      const data = await response.json();
      console.log('✅ Products received:', data);
      
      return data.products || data || [];
      
    } catch (error) {
      console.warn('⚠️ Using empty data due to error:', error);
      return [];
    }
  }
}