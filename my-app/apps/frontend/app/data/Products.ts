// apps/frontend/data/Products.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string | null;
  images: string[];  // ← Plural para coincidir con el backend
  description?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
}

// Interface para los productos que vienen del backend
interface ApiProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string | null;
  images: string[];  // El backend ya devuelve images[]
  description?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Función de conversión para compatibilidad (ya no es necesaria pero la dejamos por si acaso)
export function convertToCompatibleProducts(products: ApiProduct[]): Product[] {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    subcategory: product.subcategory,
    images: product.images || [],  // ← Ya usa images directamente
    description: product.description,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
    featured: product.featured
  }));
}

// Datos de ejemplo (opcional - puedes eliminarlos luego)
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Remera Deportiva",
    price: 2990,
    category: "mujer",
    subcategory: "remeras",
    images: ["/images/mujer/remera1.jpg"],
    description: "Remera deportiva de alta calidad",
    sizes: ["S", "M", "L"],
    colors: ["Negro", "Blanco"],
    stock: 10,
    featured: true
  }
];

export function getProductsByCategory(category: string): Product[] {
  return mockProducts.filter(product => product.category === category);
}