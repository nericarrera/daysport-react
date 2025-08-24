import { Product } from '../app/types/product';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Variable para controlar si usamos mock data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || false;

export class ProductService {
  // Headers comunes para todas las peticiones
  private static getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Método común para manejar peticiones fetch
  private static async fetchApi(endpoint: string, options: RequestInit = {}) {
    // Si estamos usando mock data, no intentar conectar al backend
    if (USE_MOCK_DATA) {
      return this.getMockData(endpoint);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch {
      console.warn(`⚠️ Backend no disponible, usando mock data para: ${endpoint}`);
      return this.getMockData(endpoint);
    }
  }

  private static getMockData(endpoint: string): Product[] | Product | null {
  console.log('📦 Usando datos mock para:', endpoint);

  if (endpoint.includes('/products?')) {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const category = urlParams.get('category');
    return this.getMockProductsByCategory(category || '');
  }

  if (endpoint.includes('/products/')) {
    const id = parseInt(endpoint.split('/').pop() || '1');
    return this.getMockProductById(id);
  }

  if (endpoint === '/products') {
    return this.getAllMockProducts();
  }

  if (endpoint.includes('featured=true')) {
    return this.getMockProductsByCategory('').filter(p => p.featured);
  }

  return [];
}
  // Mock products por categoría
  private static getMockProductsByCategory(category: string): Product[] {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Top Deportivo Energy",
        price: 39.99,
        originalPrice: 49.99,
        category: "mujer",
        subcategory: "tops",
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"],
        mainImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        description: "Top deportivo de alta compresión para máximo soporte",
        sizes: ["XS", "S", "M", "L"],
        colors: ["negro", "azul marino", "rosa"],
        inStock: true,
        stockQuantity: 25,
        featured: true,
        brand: "Nike",
        rating: 4.5,
        reviewCount: 12
      },
      {
        id: 2,
        name: "Leggings Power Flex",
        price: 69.99,
        category: "mujer",
        subcategory: "pantalones",
        images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500"],
        mainImage: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500",
        description: "Leggings de alta calidad con cintura alta y bolsillo lateral",
        sizes: ["S", "M", "L", "XL"],
        colors: ["negro", "gris", "morado"],
        inStock: true,
        stockQuantity: 18,
        featured: true,
        brand: "Adidas",
        rating: 4.2,
        reviewCount: 8
      },
      {
        id: 3,
        name: "Camiseta Training Tech",
        price: 45.99,
        category: "hombre",
        subcategory: "camisetas",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        description: "Camiseta técnica para entrenamiento de alto rendimiento",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["negro", "blanco", "gris"],
        inStock: true,
        stockQuantity: 30,
        featured: true,
        brand: "Nike",
        rating: 4.3,
        reviewCount: 15
      },
      {
        id: 4,
        name: "Mochila Hydration Pro",
        price: 89.99,
        category: "accesorios",
        subcategory: "mochilas",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
        mainImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        description: "Mochila hidratación con compartimento para laptop",
        colors: ["negro", "azul", "verde"],
        inStock: true,
        stockQuantity: 10,
        featured: true,
        brand: "Osprey",
        rating: 4.7,
        reviewCount: 20
      }
    ];

    if (!category) return mockProducts;
    
    return mockProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Mock product por ID
  private static getMockProductById(id: number): Product | null {
    const product = this.getAllMockProducts().find(p => p.id === id);
    return product || null;
  }

  // Todos los mock products
  private static getAllMockProducts(): Product[] {
    return this.getMockProductsByCategory('');
  }

  // Los métodos públicos se mantienen igual
  static async getProductsByCategory(category: string): Promise<Product[]> {
    return await this.fetchApi(`/products?category=${encodeURIComponent(category)}`);
  }

  static async getProductById(id: number): Promise<Product | null> {
    return await this.fetchApi(`/products/${id}`);
  }

  static async getAllProducts(): Promise<Product[]> {
    return await this.fetchApi('/products');
  }

  static async getFeaturedProducts(): Promise<Product[]> {
    return await this.fetchApi('/products?featured=true');
  }

  static async searchProducts(query: string): Promise<Product[]> {
    return await this.fetchApi(`/products/search?q=${encodeURIComponent(query)}`);
  }

  static async getProductsPaginated(page: number = 1, limit: number = 10): Promise<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
  }> {
    const response = await this.fetchApi(`/products?page=${page}&limit=${limit}`);
    return response || {
      products: [],
      totalPages: 0,
      currentPage: page,
      totalProducts: 0
    };
  }
}