const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ProductService {
  static async getProductsByCategory(category: string): Promise<any[]> {
    try {
      console.log('🔄 Intentando conectar a:', `${API_BASE_URL}/api/products?category=${category}`);
      
      const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP! estado: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Datos recibidos del backend:', data);
      return data;

    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando datos de prueba...', error);
      
      // Datos de prueba para desarrollo
      return [
        {
          id: 1,
          name: "Top Deportivo Energy Fit",
          price: 39.99,
          category: category,
          images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"],
          mainImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
          inStock: true,
          featured: true
        },
        {
          id: 2,
          name: "Leggings Power Flex",
          price: 69.99,
          category: category,
          images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500"],
          mainImage: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500",
          inStock: true,
          featured: true
        }
      ];
    }
  }
}