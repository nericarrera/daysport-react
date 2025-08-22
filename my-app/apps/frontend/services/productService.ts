const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Importa el tipo Product
import { Product } from '../app/Types';

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log(`🌐 Intentando conectar a: ${API_BASE_URL}/api/products?category=${category}`);
      
      const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`);
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        console.warn('⚠️ API no disponible, usando datos mock');
        return this.getMockProducts(category);
      }
      
      const data = await response.json();
      console.log('✅ Datos de API:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error conectando con API, usando datos mock:', error);
      return this.getMockProducts(category);
    }
  }

  // Función de respaldo con datos mock
  private static getMockProducts(category: string): Product[] {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Remera Deportiva Mujer',
        price: 2990,
        category: 'mujer',
        subcategory: 'remeras',
        images: ['/images/mujer/remera1.jpg'],
        description: 'Remera deportiva de alta calidad',
        sizes: ['S', 'M', 'L'],
        colors: ['Negro', 'Blanco'],
        stock: 10,
        featured: true
      },
      {
        id: 2,
        name: 'Short Deportivo Hombre',
        price: 2490,
        category: 'hombre',
        subcategory: 'shorts',
        images: ['/images/hombre/short1.jpg'],
        description: 'Short cómodo para deporte',
        sizes: ['M', 'L', 'XL'],
        colors: ['Negro', 'Gris'],
        stock: 15,
        featured: true
      },
      {
        id: 3,
        name: 'Conjunto Niños',
        price: 4590,
        category: 'ninos',
        subcategory: 'conjuntos',
        images: ['/images/ninos/conjunto1.jpg'],
        description: 'Conjunto deportivo para niños',
        sizes: ['4', '6', '8'],
        colors: ['Azul', 'Rojo'],
        stock: 8,
        featured: true
      },
      {
        id: 4,
        name: 'Botella Deportiva',
        price: 1990,
        category: 'accesorios',
        subcategory: 'hidratacion',
        images: ['/images/accesorios/botella1.jpg'],
        description: 'Botella deportiva de alta calidad',
        sizes: ['Único'],
        colors: ['Azul', 'Negro'],
        stock: 20,
        featured: true
      }
    ];

    return mockProducts.filter(product => product.category === category);
  }
}