// types/product.ts

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;           // precio tachado
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];                 // galería de imágenes
  mainImage: string;                // imagen principal (obligatoria)
  mainImageUrl?: string;            // URL externa de la imagen principal
  sizes?: string[];                 // tallas disponibles
  colors?: string[];                // colores disponibles
  inStock: boolean;                 // disponible o no
  stock: number;                    // stock numérico
  stockQuantity?: number;           // stock alternativo
  featured?: boolean;               // destacado
  discountPercentage?: number;      // % de descuento
  rating?: number;                  // promedio de reviews
  reviewCount?: number;             // cantidad de reviews
  specifications?: Record<string, string>; // ficha técnica
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];                  // etiquetas SEO, búsqueda
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  sku?: string;                     // código interno
  fit?: string;                     // ajuste (ej: regular, slim, oversize)
  
  // 🚀 NUEVOS CAMPOS ÚTILES
  material?: string;                // material principal (algodón, cuero, etc.)
  gender?: 'hombre' | 'mujer' | 'niño' | 'unisex'; // público objetivo
  season?: 'verano' | 'invierno' | 'otoño' | 'primavera' | 'todas'; // temporada
  shippingInfo?: string;            // información de envío
  returnPolicy?: string;            // política de devoluciones
  warranty?: string;                // garantía
  isLimitedEdition?: boolean;       // edición limitada
  videoUrl?: string;                // video promocional / review
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