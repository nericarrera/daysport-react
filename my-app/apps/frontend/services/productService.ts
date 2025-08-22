// apps/frontend/services/productService.ts
import { Product } from '../app/Types'; // Ruta corregida

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      // Intenta conectar con la API primero
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos reales de API:', data);
        return data;
      }
      
      // Si la API falla, usa datos mock sin mostrar error
      console.log('⚠️ API no disponible, usando datos mock temporalmente');
      return this.getMockProducts(category);
      
    } catch (error) {
      // Si hay error de conexión, usa datos mock silenciosamente
      console.log('🔇 Error de conexión, usando datos mock');
      return this.getMockProducts(category);
    }
  }

  private static getMockProducts(category: string): Product[] {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Remera Deportiva Mujer Fit',
        price: 2990,
        category: 'mujer',
        subcategory: 'remeras',
        images: ['/images/mujer/remera-fit.jpg'],
        description: 'Remera deportiva de alta calidad',
        sizes: ['S', 'M', 'L'],
        colors: ['Negro', 'Blanco'],
        stock: 15,
        featured: true
      },
      {
        id: 2,
        name: 'Short Deportivo Mujer',
        price: 2490,
        category: 'mujer',
        subcategory: 'shorts',
        images: ['/images/mujer/short-deportivo.jpg'],
        description: 'Short cómodo para actividades deportivas',
        sizes: ['XS', 'S', 'M'],
        colors: ['Negro', 'Gris'],
        stock: 20,
        featured: false
      }
    ];

    return mockProducts.filter(product => product.category === category);
  }
}