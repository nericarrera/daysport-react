export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  mainImage: string; // ✅ Esta propiedad es requerida
  sizes?: string[];
  colors?: string[];
  inStock: boolean; // ✅ Cambiado de "stock" a "inStock"
  stockQuantity?: number; // ✅ Nueva propiedad para cantidad
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
  slug?: string;       
}