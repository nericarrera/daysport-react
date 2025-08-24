
import { Product } from '../types/product';

export const products: Product[] = [
  // ========== MUJER ==========
  {
    id: 1,
    name: "Top Deportivo Energy",
    price: 39.99,
    originalPrice: 49.99,
    category: "mujer",
    subcategory: "tops",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
      "https://images.unsplash.com/photo-1506629905877-52a5ca6d63b1?w=500"
    ],
    mainImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
    description: "Top deportivo de alta compresión para máximo soporte",
    sizes: ["XS", "S", "M", "L"],
    colors: ["negro", "azul marino", "rosa", "verde"],
    inStock: true,
    stockQuantity: 25,
    featured: true,
    brand: "Nike"
  },
  {
    id: 2,
    name: "Leggings Power Flex",
    price: 69.99,
    category: "mujer",
    subcategory: "pantalones",
    images: [
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500",
      "https://images.unsplash.com/photo-1506629905877-52a5ca6d63b1?w=500"
    ],
    mainImage: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500",
    description: "Leggings de alta calidad con cintura alta y bolsillo lateral",
    sizes: ["S", "M", "L", "XL"],
    colors: ["negro", "gris", "morado"],
    inStock: true,
    stockQuantity: 18,
    featured: true,
    brand: "Adidas"
  },
  {
    id: 3,
    name: "Short Running Pro",
    price: 34.99,
    category: "mujer", 
    subcategory: "shorts",
    images: [
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500"
    ],
    mainImage: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500",
    description: "Short de running con tecnología dry-fit",
    sizes: ["XS", "S", "M"],
    colors: ["negro", "azul", "rojo"],
    inStock: true,
    stockQuantity: 12,
    brand: "Under Armour"
  },

  // ========== HOMBRE ==========
  {
    id: 4,
    name: "Camiseta Training Tech",
    price: 45.99,
    category: "hombre",
    subcategory: "camisetas",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    ],
    mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description: "Camiseta técnica para entrenamiento de alto rendimiento",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["negro", "blanco", "gris"],
    inStock: true,
    stockQuantity: 30,
    featured: true,
    brand: "Nike"
  },
  {
    id: 5,
    name: "Pantalón Jogger Sport",
    price: 79.99,
    category: "hombre",
    subcategory: "pantalones", 
    images: [
      "https://images.unsplash.com/photo-1551686057-d5c0c12b6ef7?w=500"
    ],
    mainImage: "https://images.unsplash.com/photo-1551686057-d5c0c12b6ef7?w=500",
    description: "Pantalón jogger con ajuste perfecto para deporte y casual",
    sizes: ["M", "L", "XL"],
    colors: ["gris oscuro", "negro", "verde"],
    inStock: true,
    stockQuantity: 15,
    featured: true,
    brand: "Puma"
  },
  {
    id: 6, 
    name: "Short Deportivo Ultra",
    price: 42.99,
    category: "hombre",
    subcategory: "shorts",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500"
    ],
    mainImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
    description: "Short deportivo con tecnología de secado rápido",
    sizes: ["S", "M", "L", "XL"],
    colors: ["azul marino", "negro", "rojo"],
    inStock: true,
    stockQuantity: 22,
    brand: "Reebok"
  },

  // ========== ACCESORIOS ==========
  {
    id: 7,
    name: "Mochila Hydration Pro",
    price: 89.99,
    category: "accesorios",
    subcategory: "mochilas",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    mainImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    description: "Mochila hidratación con compartimento para laptop",
    colors: ["negro", "azul", "verde"],
    inStock: true,
    stockQuantity: 10,
    featured: true,
    brand: "Osprey"
  },
  {
    id: 8,
    name: "Guantes Training Grip",
    price: 29.99,
    category: "accesorios",
    subcategory: "guantes",
    images: [
      "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500"
    ],
    mainImage: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500",
    description: "Guantes con agarre mejorado para gym",
    sizes: ["S", "M", "L"],
    colors: ["negro", "rojo", "azul"],
    inStock: true,
    stockQuantity: 20,
    brand: "Harbinger"
  }
];

// ✅ Función corregida para obtener productos por categoría
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product: Product) => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

// ✅ Función corregida para obtener productos por subcategoría
export const getProductsBySubcategory = (subcategory: string): Product[] => {
  return products.filter((product: Product) =>
    product.subcategory?.toLowerCase() === subcategory.toLowerCase()
  );
};

// ✅ Función para obtener producto por ID
export const getProductById = (id: number): Product | undefined => {
  return products.find((product: Product) => product.id === id);
};

// ✅ Función para obtener productos destacados
export const getFeaturedProducts = (): Product[] => {
  return products.filter((product: Product) => product.featured);
};

// ✅ Función para buscar productos
export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter((product: Product) =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    product.subcategory?.toLowerCase().includes(lowerQuery)
  );
};