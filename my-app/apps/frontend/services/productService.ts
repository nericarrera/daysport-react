const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ProductService {
  private static async fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  // Todos los productos con filtros
  static async getProducts(filters: {
    category?: string;
    subcategory?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });

    return this.fetchApi(`/products?${params}`);
  }

  // Productos por categoría
  static async getProductsByCategory(category: string, filters = {}) {
    return this.getProducts({ category, ...filters });
  }

  // Productos nuevos
  static async getNewProducts(limit: number = 10) {
    return this.fetchApi(`/products/new?limit=${limit}`);
  }

  // Producto por ID
  static async getProductById(id: number) {
    return this.fetchApi(`/products/${id}`);
  }
}