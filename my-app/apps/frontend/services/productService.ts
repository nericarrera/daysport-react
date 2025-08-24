import { Product } from '../app/types/product';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error; // Relanzamos el error para que el caller pueda manejarlo
    }
  }

  // Obtener productos por categoría
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      return await this.fetchApi(`/products?category=${encodeURIComponent(category)}`);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return []; // Retorna array vacío en caso de error
    }
  }

  // Obtener producto por ID
  static async getProductById(id: number): Promise<Product | null> {
    try {
      return await this.fetchApi(`/products/${id}`);
    } catch (error) {
      console.error('Error fetching product by id:', error);
      return null;
    }
  }

  // Obtener todos los productos (opcional)
  static async getAllProducts(): Promise<Product[]> {
    try {
      return await this.fetchApi('/products');
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  }

  // Obtener productos destacados (opcional)
  static async getFeaturedProducts(): Promise<Product[]> {
    try {
      return await this.fetchApi('/products?featured=true');
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Buscar productos (opcional)
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      return await this.fetchApi(`/products/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Obtener productos con paginación (opcional)
  static async getProductsPaginated(page: number = 1, limit: number = 10): Promise<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
  }> {
    try {
      return await this.fetchApi(`/products?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Error fetching paginated products:', error);
      return {
        products: [],
        totalPages: 0,
        currentPage: page,
        totalProducts: 0
      };
    }
  }
}