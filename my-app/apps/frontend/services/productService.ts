// apps/frontend/services/productService.ts
// Importa el tipo Product
import { Product } from '../app/Types'; // ← Asegúrate de que la ruta sea correcta

export class ProductService {
  static async getProductsByCategory(category: string): Promise<Product[]> {
    // USAR DIRECTAMENTE DATOS MOCK MIENTRAS SE ARREGLA EL BACKEND
    console.log('⚠️ Usando datos mock temporalmente');
    return this.getMockProducts(category);
  }

  private static getMockProducts(category: string): Product[] {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Remera Deportiva Mujer Fit',
        price: 2990,
        category: 'mujer',
        subcategory: 'remeras',
        images: ['/images/mujer/remera-fit.jpg'],
        description: 'Remera deportiva de alta calidad',
        sizes: ['S', 'M', 'L'],
        colors: ['Negro', 'Blanco'],
        stock: 15,
        featured: true
      },
      {
        id: 2,
        name: 'Short Deportivo Mujer',
        price: 2490,
        category: 'mujer', 
        subcategory: 'shorts',
        images: ['/images/mujer/short-deportivo.jpg'],
        description: 'Short cómodo para actividades deportivas',
        sizes: ['XS', 'S', 'M'],
        colors: ['Negro', 'Gris'],
        stock: 20,
        featured: false
      },
      {
        id: 3,
        name: 'Remera Deportiva Hombre',
        price: 2790,
        category: 'hombre',
        subcategory: 'remeras',
        images: ['/images/hombre/remera-deportiva.jpg'],
        description: 'Remera deportiva para hombre de alta calidad',
        sizes: ['M', 'L', 'XL'],
        colors: ['Negro', 'Blanco', 'Rojo'],
        stock: 18,
        featured: true
      },
      {
        id: 4,
        name: 'Pantalón Deportivo Hombre',
        price: 3990,
        category: 'hombre',
        subcategory: 'pantalones',
        images: ['/images/hombre/pantalon-deportivo.jpg'],
        description: 'Pantalón cómodo para entrenamiento',
        sizes: ['M', 'L', 'XL'],
        colors: ['Negro', 'Gris'],
        stock: 12,
        featured: true
      }
    ];

    return mockProducts.filter(product => product.category === category);
  }
}