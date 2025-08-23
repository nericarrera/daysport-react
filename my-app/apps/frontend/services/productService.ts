'use client';
import { Product } from '../app/Types';

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`http://localhost:3001/products?category=${category}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  static async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`http://localhost:3001/products/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Opcional: Método para obtener todos los productos
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch('http://localhost:3001/products');
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  }
}