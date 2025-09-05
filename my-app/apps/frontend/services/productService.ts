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

  // Manejo de respuesta MEJORADO Y DETALLADO
  private static async handleResponse<T>(response: Response): Promise<T> {
    console.log('📨 Response status:', response.status, response.statusText);
    console.log('📨 Response URL:', response.url);
    
    if (!response.ok) {
      // ✅ Obtener MÁS información del error
      let errorText = response.statusText;
      let errorJson = null;
      
      try {
        // Intentar leer el cuerpo del error
        errorText = await response.text();
        console.log('📄 Texto crudo del error:', errorText);
        
        // Intentar parsear como JSON
        try {
          errorJson = JSON.parse(errorText);
          console.log('📦 JSON parseado del error:', errorJson);
        } catch (jsonError) {
          console.log('ℹ️ El error no es JSON, es texto plano');
        }
      } catch (textError) {
        console.error('💥 No se pudo leer el cuerpo del error:', textError);
      }
      
      // ✅ Mostrar información COMPLETA
      console.error('🚨 ERROR DETALLADO DEL BACKEND:');
      console.error('   Status:', response.status);
      console.error('   Status Text:', response.statusText);
      console.error('   URL:', response.url);
      console.error('   Body:', errorText);
      
      // ✅ Crear mensaje de error más útil
      let userMessage = `Error ${response.status}: ${response.statusText}`;
      
      if (errorJson) {
        if (errorJson.message) userMessage = errorJson.message;
        else if (errorJson.error) userMessage = errorJson.error;
      }
      
      throw new ApiError(
        response.status,
        response.statusText,
        userMessage
      );
    }
    
    // ✅ Si la respuesta es exitosa, procesar JSON
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      console.error('💥 Error parseando JSON de respuesta:', jsonError);
      throw new Error('El servidor respondió con formato inválido');
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

  // Obtener productos con filtros (VERSIÓN MEJORADA CON DEBUG DETALLADO)
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
    [key: string]: any;
  }): Promise<FilteredProductsResponse> {
    
    // ✅ DEBUG DETALLADO: Verificar CADA parámetro
    console.log('🛠️ === DEBUG DETALLADO DE FILTROS ===');
    console.log('📍 category:', filters.category);
    console.log('📍 subcategory:', filters.subcategory);
    console.log('📍 sizes:', filters.sizes, 'Tipo:', typeof filters.sizes);
    console.log('📍 colors:', filters.colors, 'Tipo:', typeof filters.colors);
    console.log('📍 brands:', filters.brands, 'Tipo:', typeof filters.brands);
    console.log('📍 priceRange:', filters.priceRange);
    console.log('=====================================');
    
    const params = new URLSearchParams();
    
    // ✅ 1. Parámetro OBLIGATORIO (siempre debe ir)
    params.append('category', filters.category);
    console.log('✅ Parámetro enviado - category:', filters.category);
    
    // ✅ 2. Parámetros OPCIONALES (solo si tienen valor)
    if (filters.subcategory && filters.subcategory !== '') {
      params.append('subcategory', filters.subcategory);
      console.log('✅ Parámetro enviado - subcategory:', filters.subcategory);
    } else {
      console.log('❌ Parámetro omitido - subcategory: vacío o undefined');
    }
    
    if (filters.sizes) {
      // Convertir array a string o dejar el string tal cual
      const sizesValue = Array.isArray(filters.sizes) 
        ? filters.sizes.filter(size => size && size !== '').join(',')
        : filters.sizes;
      
      if (sizesValue && sizesValue !== '') {
        params.append('sizes', sizesValue);
        console.log('✅ Parámetro enviado - sizes:', sizesValue);
      } else {
        console.log('❌ Parámetro omitido - sizes: vacío después de filtrar');
      }
    }
    
    if (filters.colors) {
      const colorsValue = Array.isArray(filters.colors) 
        ? filters.colors.filter(color => color && color !== '').join(',')
        : filters.colors;
      
      if (colorsValue && colorsValue !== '') {
        params.append('colors', colorsValue);
        console.log('✅ Parámetro enviado - colors:', colorsValue);
      } else {
        console.log('❌ Parámetro omitido - colors: vacío después de filtrar');
      }
    }
    
    if (filters.brands) {
      const brandsValue = Array.isArray(filters.brands) 
        ? filters.brands.filter(brand => brand && brand !== '').join(',')
        : filters.brands;
      
      if (brandsValue && brandsValue !== '') {
        params.append('brands', brandsValue);
        console.log('✅ Parámetro enviado - brands:', brandsValue);
      } else {
        console.log('❌ Parámetro omitido - brands: vacío después de filtrar');
      }
    }
    
    if (filters.priceRange && filters.priceRange !== '') {
      params.append('priceRange', filters.priceRange);
      console.log('✅ Parámetro enviado - priceRange:', filters.priceRange);
    } else {
      console.log('❌ Parámetro omitido - priceRange: vacío o undefined');
    }
    
    // Parámetros adicionales
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    // ✅ 3. Construir URL final
    const url = `${API_CONFIG.BASE_URL}/api/products/filtered/list?${params.toString()}`;
    console.log('🌐 URL final enviada al backend:', url);
    console.log('=====================================');

    try {
      const response = await this.retry(async () => {
        return await this.fetchWithTimeout(url);
      });

      console.log('🔍 Response received, processing...');
      
      const data = await this.handleResponse<FilteredProductsResponse>(response);
      
      console.log('✅ Filtered products received:', data.products?.length || 0, 'items');
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching filtered products:', error);
      
      // ✅ MEJOR FALLBACK: Manejar específicamente errores 500 y 404
      if (error instanceof ApiError && (error.status === 500 || error.status === 404)) {
        console.log('🔄 Backend endpoint /api/products/filtered no disponible, usando fallback...');
        
        try {
          // Obtener todos los productos de la categoría
          const fallbackProducts = await this.getProductsByCategory(filters.category);
          
          // Aplicar filtros localmente como fallback
          let filteredProducts = fallbackProducts;
          
          // Filtrar por subcategoría
          if (filters.subcategory) {
            filteredProducts = filteredProducts.filter(product => 
              product.subcategory?.toLowerCase() === filters.subcategory?.toLowerCase()
            );
          }

          
          // ✅ CORRECCIÓN: Filtrar por talles de forma segura
          if (filters.sizes) {
            const sizesArray = Array.isArray(filters.sizes) ? filters.sizes : [filters.sizes];
            if (sizesArray.length > 0) {
              filteredProducts = filteredProducts.filter(product => {
                // Verificar que product.sizes existe y es un array
                if (!product.sizes || !Array.isArray(product.sizes)) return false;
                
                // Usar el operador de aserción no nula (!) porque ya verificamos que existe
                return sizesArray.some(size => 
                  product.sizes!.includes(size)
                );
              });
            }
          }
          
          // ✅ DEBUG: Verificar el tipo y valor de filters.colors
          console.log('=== DEBUG filters.colors ===');
          console.log('Tipo de filters.colors:', typeof filters.colors);
          console.log('Valor de filters.colors:', filters.colors);
          console.log('Es array?:', Array.isArray(filters.colors));
          if (filters.colors) {
            console.log('Longitud:', Array.isArray(filters.colors) ? filters.colors.length : 1);
            console.log('Primer elemento:', Array.isArray(filters.colors) ? filters.colors[0] : filters.colors);
            console.log('Tipo primer elemento:', Array.isArray(filters.colors) ? typeof filters.colors[0] : typeof filters.colors);
          }
          console.log('===========================');

          // ✅ CORRECCIÓN COMPLETA: Filtrar por colores de forma segura
          if (filters.colors) {
  try {
    const colorsArray = Array.isArray(filters.colors) ? filters.colors : [filters.colors];
    
    const normalizedFilterColors = colorsArray
      .filter(color => typeof color === 'string')
      .map(color => (color as string).toLowerCase().trim())
      .filter(color => color !== '');

    if (normalizedFilterColors.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        if (!product.colors) return false;
        
        const productColors = Array.isArray(product.colors) 
          ? product.colors 
          : [product.colors];
        
        const normalizedProductColors = productColors
          .filter(color => typeof color === 'string')
          .map(color => (color as string).toLowerCase().trim())
          .filter(color => color !== '');
        
        return normalizedFilterColors.some(filterColor =>
          normalizedProductColors.some(productColor =>
            productColor.includes(filterColor)
          )
        );
      });
    }
  } catch (error) {
    console.warn('Error en filtro de colores:', error);
  }
}
          
          // ✅ CORRECCIÓN: Filtrar por marcas de forma segura
          if (filters.brands) {
            const brandsArray = Array.isArray(filters.brands) ? filters.brands : [filters.brands];
            if (brandsArray.length > 0) {
              // Normalizar las marcas del filtro primero
              const normalizedFilterBrands = brandsArray.map(brand => brand.toLowerCase());
              
              filteredProducts = filteredProducts.filter(product => {
                if (!product.brand) return false;
                
                // Normalizar la marca del producto
                const normalizedProductBrand = product.brand.toLowerCase();
                
                return normalizedFilterBrands.some(filterBrand => 
                  normalizedProductBrand.includes(filterBrand)
                );
              });
            }
          }
          
          // Filtrar por rango de precio
          if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            filteredProducts = filteredProducts.filter(product => {
              const price = product.price || 0;
              if (filters.priceRange?.endsWith('+')) {
                return price >= min;
              } else {
                return price >= min && price <= max;
              }
            });
          }
          
          return {
            products: filteredProducts,
            pagination: {
              total: filteredProducts.length,
              currentPage: 1,
              totalPages: 1,
              hasNextPage: false,
              hasPrevPage: false
            },
            filters: {
              sizes: [],
              colors: [],
              brands: [],
              categories: []
            }
          };
          
        } catch (fallbackError) {
          console.error('❌ Fallback también falló:', fallbackError);
          throw new Error('No se pudieron cargar los productos');
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