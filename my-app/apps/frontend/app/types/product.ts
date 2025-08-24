export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Precio original si hay descuento
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[]; // Array de URLs de imágenes
  mainImage: string; // URL de la imagen principal
  sizes?: string[]; // Talles disponibles
  colors?: string[]; // Colores disponibles
  inStock: boolean;
  stockQuantity?: number;
  featured?: boolean;
  discountPercentage?: number;
  rating?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para la respuesta paginada
export interface PaginatedProducts {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

export interface Category {
  name: string;
  href: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  name: string;
  href: string;
  image?: string;
  slug?: string;       // ← Agregado para consistencia
}