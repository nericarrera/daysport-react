// apps/frontend/data/Products.ts
import { Product } from '../Types'; // ← Ruta corregida

// Datos de ejemplo (opcional - puedes eliminarlos luego)
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Remera Deportiva Mujer",
    price: 2990,
    category: "mujer",
    subcategory: "remeras",
    images: ["/images/mujer/remera1.jpg"],
    description: "Remera deportiva de alta calidad",
    sizes: ["S", "M", "L"],
    colors: ["Negro", "Blanco"],
    stock: 10,
    featured: true
  },
  {
    id: 2,
    name: "Short Deportivo Hombre",
    price: 2490,
    category: "hombre",
    subcategory: "shorts",
    images: ["/images/hombre/short1.jpg"],
    description: "Short cómodo para deporte",
    sizes: ["M", "L", "XL"],
    colors: ["Negro", "Gris"],
    stock: 15,
    featured: true
  },
  {
    id: 3,
    name: "Conjunto Deportivo Niño",
    price: 4590,
    category: "niños",
    subcategory: "conjuntos",
    images: ["/images/ninos/conjunto1.jpg"],
    description: "Conjunto deportivo para niños",
    sizes: ["4", "6", "8"],
    colors: ["Azul", "Rojo"],
    stock: 8,
    featured: true
  },
  {
    id: 4,
    name: "Botella Deportiva",
    price: 1990,
    category: "accesorios",
    subcategory: "hidratacion",
    images: ["/images/accesorios/botella1.jpg"],
    description: "Botella deportiva de alta calidad",
    sizes: ["Único"],
    colors: ["Azul", "Negro"],
    stock: 20,
    featured: true
  }
];

// Función para obtener productos por categoría (MOCK - temporal)
export function getProductsByCategory(category: string): Product[] {
  return mockProducts.filter(product => product.category === category);
}

// Función para obtener productos destacados
export async function getFeaturedProducts(category?: string): Promise<Product[]> {
  try {
    // Intenta conectar con la API primero
    const url = category 
      ? `http://localhost:3001/api/products?category=${category}&featured=true`
      : 'http://localhost:3001/api/products?featured=true';
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Featured products from API:', data);
      return data;
    }
    
    // Si la API falla, usa datos mock
    console.log('⚠️ Using mock featured products');
    return getFeaturedProductsMock(category);
    
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    // Fallback a datos mock si la API falla
    return getFeaturedProductsMock(category);
  }
}

// Función mock para productos destacados
export function getFeaturedProductsMock(category?: string): Product[] {
  return mockProducts.filter(product => 
    product.featured && (!category || product.category === category)
  ).slice(0, 4); // Solo 4 productos por categoría
}