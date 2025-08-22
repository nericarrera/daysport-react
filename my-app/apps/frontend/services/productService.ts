const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
      const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`);
      if (!response.ok) throw new Error('Error fetching products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }
}