// apps/frontend/services/productService.ts
import { Product } from '../app/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log('🔄 Intentando conectar a:', `${API_BASE_URL}/api/products?category=${category}`);
      
      const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Datos recibidos del backend:', data);
      
      // Asegurar que los productos tengan el tipo correcto
      return data.products || data || [];

    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando datos de prueba...', error);
      
      // Datos de prueba para desarrollo - con tipo Product
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Top Deportivo Energy Fit",
          price: 39.99,
          originalPrice: 49.99,
          category: category,
          description: "Top deportivo de alta compresión",
          images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"],
          mainImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
          sizes: ["S", "M", "L"],
          colors: ["negro", "azul"],
          inStock: true,
          stockQuantity: 15,
          featured: true,
          discountPercentage: 20,
          rating: 4.5,
          reviewCount: 128
        },
        {
          id: 2,
          name: "Leggings Power Flex",
          price: 69.99,
          originalPrice: 89.99,
          category: category,
          description: "Leggings de alta calidad",
          images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500"],
          mainImage: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500",
          sizes: ["S", "M", "L"],
          colors: ["negro", "gris"],
          inStock: true,
          stockQuantity: 10,
          featured: true,
          discountPercentage: 22,
          rating: 4.3,
          reviewCount: 89
        }
      ];
      
      return mockProducts;
    }
  }
}