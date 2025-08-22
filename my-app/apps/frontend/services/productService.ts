import { Product } from '../app/Types'; // ← Ruta corregida

export class ProductService {
  // Obtener productos por categoría
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

  // Obtener productos por categoría y subcategoría
  static async getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/products?category=${category}&subcategory=${subcategory}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos reales de API por subcategoría:', data);
        return data;
      }
      
      // Fallback: filtrar los productos de la categoría por subcategoría
      console.log('⚠️ Usando filtrado local por subcategoría');
      const categoryProducts = await this.getProductsByCategory(category);
      return categoryProducts.filter(product => product.subcategory === subcategory);
      
    } catch (error) {
      console.log('🔇 Error de conexión, usando filtrado local');
      const categoryProducts = await this.getProductsByCategory(category);
      return categoryProducts.filter(product => product.subcategory === subcategory);
    }
  }

  // Obtener un producto por ID
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      
      if (response.ok) {
        return await response.json();
      }
      
      console.log('⚠️ Producto no encontrado en API');
      return null;
      
    } catch (error) {
      console.log('🔇 Error obteniendo producto por ID');
      return null;
    }
  }

  // Datos mock de respaldo
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
      },
      {
        id: 3,
        name: 'Remera Deportiva Hombre',
        price: 2790,
        category: 'hombre',
        subcategory: 'remeras',
        images: ['/images/hombre/remera-deportiva.jpg'],
        description: 'Remera deportiva para hombre de alta calidad',
        sizes: ['M', 'L', 'XL'],
        colors: ['Negro', 'Blanco', 'Rojo'],
        stock: 18,
        featured: true
      },
      {
        id: 4,
        name: 'Pantalón Deportivo Hombre',
        price: 3990,
        category: 'hombre',
        subcategory: 'pantalones',
        images: ['/images/hombre/pantalon-deportivo.jpg'],
        description: 'Pantalón cómodo para entrenamiento',
        sizes: ['M', 'L', 'XL'],
        colors: ['Negro', 'Gris'],
        stock: 12,
        featured: true
      },
      {
        id: 5,
        name: 'Conjunto Deportivo Niño',
        price: 4590,
        category: 'ninos',
        subcategory: 'conjuntos',
        images: ['/images/ninos/conjunto1.jpg'],
        description: 'Conjunto deportivo para niños',
        sizes: ['4', '6', '8', '10'],
        colors: ['Azul', 'Rojo', 'Verde'],
        stock: 18,
        featured: true
      },
      {
        id: 6,
        name: 'Botella Deportiva 750ml',
        price: 1990,
        category: 'accesorios',
        subcategory: 'hidratacion',
        images: ['/images/accesorios/botella1.jpg'],
        description: 'Botella deportiva de alta calidad',
        sizes: ['Único'],
        colors: ['Azul', 'Negro', 'Verde'],
        stock: 50,
        featured: true
      }
    ];

    return mockProducts.filter(product => product.category === category);
  }
}