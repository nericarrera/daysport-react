import { ProductService } from './productService';

export interface FilterOptions {
  sizes: string[];
  colors: string[];
  brands: string[];
  priceRanges: { id: string; label: string }[];
  categories: string[];
}

export class FilterService {
  // Obtener opciones de filtro desde el backend
  static async getFilterOptions(category: string): Promise<FilterOptions> {
    try {
      // Aquí conectas con tu endpoint del backend
      const response = await fetch(`/api/filters/${category}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener opciones de filtro');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching filter options:', error);
      // Devolver opciones por defecto si falla la conexión
      return this.getDefaultFilterOptions(category);
    }
  }

  // Opciones por defecto organizadas por categoría
  private static getDefaultFilterOptions(category: string): FilterOptions {
    const baseSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const numericSizes = ['28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56'];
    const kidsSizes = ['6', '8', '10', '12', '14', '16'];
    
    const commonColors = ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Gris', 'Rosa', 'Beige', 'Amarillo'];
    const commonBrands = ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok'];
    
    const priceRanges = [
      { id: '0-25', label: 'Menos de $25' },
      { id: '25-50', label: '$25 - $50' },
      { id: '50-100', label: '$50 - $100' },
      { id: '100-200', label: '$100 - $200' },
      { id: '200+', label: 'Más de $200' }
    ];

    // Configuración específica por categoría
    const categoryConfig: { [key: string]: Partial<FilterOptions> } = {
      hombre: {
        sizes: [...baseSizes, ...numericSizes],
        categories: ['remeras', 'shorts', 'bermudas', 'buzos', 'zapatillas', 'jeans', 'camisetas']
      },
      mujer: {
        sizes: [...baseSizes, ...numericSizes.slice(0, 8)], // Talles más comunes para mujer
        categories: ['remeras', 'shorts', 'calzas', 'buzos', 'zapatillas', 'vestidos', 'faldas']
      },
      niños: {
        sizes: kidsSizes,
        categories: ['remeras', 'shorts', 'conjuntos', 'zapatillas', 'buzos']
      },
      accesorios: {
        sizes: ['Único', 'XS', 'S', 'M', 'L'],
        categories: ['hidratacion', 'medias', 'gorras', 'mochilas', 'guantes']
      }
    };

    const config = categoryConfig[category] || {};

    return {
      sizes: config.sizes || baseSizes,
      colors: commonColors,
      brands: commonBrands,
      priceRanges,
      categories: config.categories || []
    };
  }

  // Obtener productos filtrados desde el backend
  static async getFilteredProducts(filters: any, category: string, page = 1, limit = 20) {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: limit.toString(),
        category
      });

      const response = await fetch(`/api/products/filtered?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener productos filtrados');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  }
}