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

// Tipo de respuesta
interface ProductsResponse {
  products?: Product[];
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

  // Extraer productos de la respuesta
  private static extractProductsFromResponse(
    data: ProductsResponse | Product[]
  ): Product[] {
    if (Array.isArray(data)) return data;
    if (data.products && Array.isArray(data.products)) return data.products;
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

  // Obtener productos con filtros (NUEVO método)
  static async getFilteredProducts(filters: {
    category: string;
    subcategory?: string;
    sizes?: string[];
    colors?: string[];
    brands?: string[];
    priceRange?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    params.append('category', filters.category);

    if (filters.subcategory) params.append('subcategory', filters.subcategory);
    if (filters.sizes?.length) params.append('sizes', filters.sizes.join(','));
    if (filters.colors?.length) params.append('colors', filters.colors.join(','));
    if (filters.brands?.length) params.append('brands', filters.brands.join(','));
    if (filters.priceRange) params.append('priceRange', filters.priceRange);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const url = `${API_CONFIG.BASE_URL}/api/products/filtered/list?${params.toString()}`;

    try {
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<ProductsResponse>(response);
    } catch (error) {
      console.error('❌ Error fetching filtered products:', error);
      throw error;
    }
  }
}
