import { fetchAPI } from '../lib/api/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string | null;
  images: string[];
  description?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      return await fetchAPI(`/api/products?category=${category}`);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  static async getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
    try {
      return await fetchAPI(`/api/products?category=${category}&subcategory=${subcategory}`);
    } catch (error) {
      console.error('Error fetching products by subcategory:', error);
      return [];
    }
  }

  static async getFeaturedProducts(): Promise<Product[]> {
    try {
      return await fetchAPI('/api/products?featured=true');
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  static async getProductById(id: number): Promise<Product | null> {
    try {
      return await fetchAPI(`/api/products/${id}`);
    } catch (error) {
      console.error('Error fetching product by id:', error);
      return null;
    }
  }
}