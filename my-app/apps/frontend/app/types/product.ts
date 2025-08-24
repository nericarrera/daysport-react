export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;  // ← Para descuentos
  category: string;
  subcategory?: string;
  brand?: string;          // ← Marca del producto
  images: string[];
  mainImage: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  stockQuantity?: number;  // ← Cantidad exacta
  featured?: boolean;
  discountPercentage?: number;
  rating?: number;         // ← Rating del producto
  reviewCount?: number;    // ← Número de reviews
  specifications?: Record<string, string>;
  createdAt?: string;      // ← Fecha de creación para "NUEVO"
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
  slug?: string;       
}