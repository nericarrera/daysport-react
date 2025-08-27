import { Product } from '../app/types/product';

// Configuración de la API
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 2,
} as const;

// Tipos de error personalizados
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Tipo para la respuesta de la API
interface ProductsResponse {
  products?: Product[];
  // Puedes agregar otros campos que pueda devolver tu API
  message?: string;
  status?: string;
}

export class ProductService {
  private static async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = API_CONFIG.TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError();
      }
      throw new NetworkError(error instanceof Error ? error.message : 'Unknown network error');
    }
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        `HTTP error! status: ${response.status}`
      );
    }

    try {
      return await response.json();
    } catch {
      throw new Error('Failed to parse JSON response');
    }
  }

  private static async retry<T>(
    fn: () => Promise<T>,
    retries: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        console.log(`Retrying... ${retries} attempts left`);
        // Esperar un poco antes de reintentar (backoff exponencial simple)
        await new Promise(resolve => setTimeout(resolve, 1000 * (API_CONFIG.RETRY_ATTEMPTS - retries + 1)));
        return this.retry(fn, retries - 1);
      }
      throw error;
    }
  }

  private static isRetryableError(error: unknown): boolean {
    return (
      error instanceof NetworkError ||
      error instanceof TimeoutError ||
      (error instanceof ApiError && error.status >= 500)
    );
  }

  // Helper para extraer productos de la respuesta
  private static extractProductsFromResponse(data: ProductsResponse | Product[]): Product[] {
    // Si la respuesta es directamente un array de productos
    if (Array.isArray(data)) {
      return data;
    }
    
    // Si la respuesta es un objeto con propiedad products
    if (data.products && Array.isArray(data.products)) {
      return data.products;
    }
    
    // Si no hay productos, devolver array vacío
    return [];
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    const url = `${API_CONFIG.BASE_URL}/api/products?category=${encodeURIComponent(category)}`;
    
    console.log('🔄 Fetching products for:', category, 'from:', url);

    try {
      const data = await this.retry(async () => {
        const response = await this.fetchWithTimeout(url);
        return this.handleResponse<ProductsResponse | Product[]>(response);
      });

      const products = this.extractProductsFromResponse(data);
      console.log('✅ Products received:', products.length, 'items');
      
      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      
      // Podrías implementar aquí un fallback a datos locales o caché
      // return this.getFallbackData(category);
      
      throw error; // Propaga el error para que el llamador pueda manejarlo
    }
  }

  // Método adicional para obtener un producto por ID
  static async getProductById(id: string): Promise<Product | null> {
    const url = `${API_CONFIG.BASE_URL}/api/products/${id}`;
    
    try {
      const response = await this.fetchWithTimeout(url);
      const product = await this.handleResponse<Product>(response);
      
      return product;
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      return null;
    }
  }

  // Método adicional para obtener productos con múltiples filtros
  static async getProductsWithFilters(filters: {
    category?: string;
    subcategory?: string;
    priceRange?: [number, number];
    limit?: number;
    sortBy?: string;
  }): Promise<Product[]> {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.subcategory) params.append('subcategory', filters.subcategory);
    if (filters.priceRange) {
      params.append('minPrice', filters.priceRange[0].toString());
      params.append('maxPrice', filters.priceRange[1].toString());
    }
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    
    const url = `${API_CONFIG.BASE_URL}/api/products?${params.toString()}`;
    
    try {
      const response = await this.fetchWithTimeout(url);
      const data = await this.handleResponse<ProductsResponse | Product[]>(response);
      
      return this.extractProductsFromResponse(data);
    } catch (error) {
      console.error('❌ Error fetching products with filters:', error);
      throw error;
    }
  }
}