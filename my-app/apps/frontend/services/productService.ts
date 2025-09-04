import { Product } from '../app/types/product';

// Usamos fetch universal para cliente y servidor
const _fetch = globalThis.fetch;

// Configuración de la API
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 15000, // Timeout en ms
  RETRY_ATTEMPTS: 3, // Número de reintentos
} as const;

// Errores personalizados
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

// Tipo de respuesta para productos filtrados
export interface FilteredProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: {
    sizes: string[];
    colors: string[];
    brands: string[];
    categories: string[];
  };
}

// Tipo de respuesta para productos normales
interface ProductsResponse {
  products?: Product[];
  data?: Product[];
  items?: Product[];
  pagination?: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
  message?: string;
  status?: string;
}

export class ProductService {
  // Fetch con timeout
  private static async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = API_CONFIG.TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await _fetch(url, {
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
      throw new NetworkError(
        error instanceof Error ? error.message : 'Unknown network error'
      );
    }
  }

  // Manejo de respuesta
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new ApiError(
        response.status,
        response.statusText,
        errorText || `HTTP error! status: ${response.status}`
      );
    }
    try {
      return await response.json();
    } catch {
      throw new Error('Failed to parse JSON response');
    }
  }

  // Reintentos con backoff
  private static async retry<T>(
    fn: () => Promise<T>,
    retries: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        console.warn(`Retrying... ${retries} attempts left`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (API_CONFIG.RETRY_ATTEMPTS - retries + 1))
        );
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

  // Extraer productos de la respuesta (compatible con múltiples formatos)
  private static extractProductsFromResponse(
    data: ProductsResponse | Product[] | any
  ): Product[] {
    if (Array.isArray(data)) return data;
    if (data?.products && Array.isArray(data.products)) return data.products;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  }

  // Obtener productos por categoría
  static async getProductsByCategory(category: string = 'all'): Promise<Product[]> {
    const url = category === 'all' 
      ? `${API_CONFIG.BASE_URL}/api/products`
      : `${API_CONFIG.BASE_URL}/api/products?category=${encodeURIComponent(category)}`;

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
      throw error;
    }
  }

  // Obtener producto por ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      console.log('🔍 Getting product by ID:', id);
      const url = `${API_CONFIG.BASE_URL}/api/products/${id}`;
      const response = await this.fetchWithTimeout(url);
      const data = await this.handleResponse<Product>(response);
      return data;
    } catch (error) {
      console.error('❌ Error in getProductById:', error);
      return null;
    }
  }

  // Obtener productos con filtros (VERSIÓN MEJORADA)
  static async getProductsWithFilters(filters: {
    category: string;
    subcategory?: string;
    sizes?: string | string[];
    colors?: string | string[];
    brands?: string | string[];
    priceRange?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    [key: string]: any; // Para filtros adicionales
  }): Promise<FilteredProductsResponse> {
    const params = new URLSearchParams();
    
    // Parámetros base
    params.append('category', filters.category);
    
    // Parámetros opcionales
    if (filters.subcategory) params.append('subcategory', filters.subcategory);
    
    // Manejar arrays y strings para sizes
    if (filters.sizes) {
      if (Array.isArray(filters.sizes)) {
        params.append('sizes', filters.sizes.join(','));
      } else {
        params.append('sizes', filters.sizes);
      }
    }
    
    // Manejar arrays y strings para colors
    if (filters.colors) {
      if (Array.isArray(filters.colors)) {
        params.append('colors', filters.colors.join(','));
      } else {
        params.append('colors', filters.colors);
      }
    }
    
    // Manejar arrays y strings para brands
    if (filters.brands) {
      if (Array.isArray(filters.brands)) {
        params.append('brands', filters.brands.join(','));
      } else {
        params.append('brands', filters.brands);
      }
    }
    
    if (filters.priceRange) params.append('priceRange', filters.priceRange);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const url = `${API_CONFIG.BASE_URL}/api/products/filtered?${params.toString()}`;
    
    console.log('🎯 Fetching filtered products from:', url);
    console.log('📋 Filters applied:', filters);

    try {
      const response = await this.retry(async () => {
        return await this.fetchWithTimeout(url);
      });

      const data = await this.handleResponse<FilteredProductsResponse>(response);
      
      console.log('✅ Filtered products received:', data.products?.length || 0, 'items');
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching filtered products:', error);
      
      // Fallback: intentar obtener productos sin filtros
      if (error instanceof ApiError && error.status === 404) {
        console.log('🔄 Endpoint not found, trying without filters...');
        try {
          const fallbackProducts = await this.getProductsByCategory(filters.category);
          return {
            products: fallbackProducts,
            pagination: {
              total: fallbackProducts.length,
              currentPage: 1,
              totalPages: 1,
              hasNextPage: false,
              hasPrevPage: false
            }
          };
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
        }
      }
      
      throw error;
    }
  }

  // Obtener opciones de filtro desde el backend
  static async getFilterOptions(category: string): Promise<{
    sizes: string[];
    colors: string[];
    brands: string[];
    categories: string[];
    priceRanges: { id: string; label: string }[];
  }> {
    const url = `${API_CONFIG.BASE_URL}/api/products/filters/${encodeURIComponent(category)}`;
    
    console.log('🔄 Fetching filter options for:', category);

    try {
      const response = await this.fetchWithTimeout(url);
      const data = await this.handleResponse<{
        sizes: string[];
        colors: string[];
        brands: string[];
        categories: string[];
        priceRanges: { id: string; label: string }[];
      }>(response);
      
      console.log('✅ Filter options received');
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching filter options:', error);
      
      // Devolver opciones por defecto si el endpoint no existe
      return {
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Gris', 'Rosa'],
        brands: ['Nike', 'Adidas', 'Puma', 'Under Armour'],
        categories: ['remeras', 'shorts', 'bermudas', 'buzos', 'zapatillas'],
        priceRanges: [
          { id: '0-25', label: 'Menos de $25' },
          { id: '25-50', label: '$25 - $50' },
          { id: '50-100', label: '$50 - $100' },
          { id: '100-200', label: '$100 - $200' },
          { id: '200+', label: 'Más de $200' }
        ]
      };
    }
  }

  // Buscar productos por término de búsqueda
  static async searchProducts(query: string, category?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (category) params.append('category', category);

    const url = `${API_CONFIG.BASE_URL}/api/products/search?${params.toString()}`;

    try {
      const response = await this.fetchWithTimeout(url);
      const data = await this.handleResponse<{ products: Product[] }>(response);
      return data.products || [];
    } catch (error) {
      console.error('❌ Error searching products:', error);
      return [];
    }
  }
}