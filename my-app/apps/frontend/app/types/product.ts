export interface Product {
  id: number;
  name: string;
  slug: string;  // ← NUEVO: esencial para URLs amigables
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  mainImage: string;
  mainImageUrl?: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;  // ← CAMBIADO: de number a boolean
  stock: number;     // ← NUEVO: cantidad real en stock
  stockQuantity?: number;
  featured?: boolean;
  discountPercentage?: number;
  rating?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  // Campos adicionales que podrías necesitar
  tags?: string[];
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  sku?: string;
}

// Tipo para la respuesta paginada
export interface PaginatedProducts {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Category {
  id: number;        // ← NUEVO: importante para relaciones
  name: string;
  slug: string;      // ← NUEVO: para URLs
  href: string;
  description?: string;
  image?: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;        // ← NUEVO: importante para relaciones
  name: string;
  slug: string;      // ← NUEVO: para URLs
  href: string;
  image?: string;
  categoryId?: number; // ← NUEVO: relación con categoría padre
}

// ✅ Tipos adicionales que necesitarás
export interface ProductFilter {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  size?: string;
  color?: string;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: 'price' | 'name' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}