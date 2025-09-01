export interface Product {
  id: number;
  name: string;
  slug: string;
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
  inStock: boolean;
  stock: number;
  stockQuantity?: number;
  featured?: boolean;
  discountPercentage?: number;
  rating?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  sku?: string;
  fit?: string;
  
  // ✅ NUEVAS PROPIEDADES para medidas y guía de tallas
  measurements?: {
    chest?: string;       // Pecho/Busto
    waist?: string;       // Cintura
    hips?: string;        // Cadera
    length?: string;      // Largo total
    sleeve?: string;      // Largo de manga
    shoulder?: string;    // Ancho de hombros
    thigh?: string;       // Muslo (para pantalones)
    inseam?: string;      // Entre pierna (para pantalones)
    // Agrega más según necesites
  };
  
  sizeGuide?: {
    title?: string;
    description?: string;
    tables?: Array<{
      title: string;
      type: 'upper' | 'lower' | 'general' | 'accessories';
      headers: string[];
      rows: string[][];
    }>;
  };
  
  // ✅ Para imágenes por color y detalles
  colorImages?: Record<string, string[]>;
  detailImages?: string[];
  
  // ✅ Información de envío y garantía
  shippingInfo?: {
    freeShipping: boolean;
    freeShippingThreshold?: number;
    deliveryTime: string;
    returns: boolean;
    returnPeriod?: number; // días
  };
  
  // ✅ Metadatos para SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
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
  id: number;
  name: string;
  slug: string;
  href: string;
  description?: string;
  image?: string;
  subcategories: Subcategory[];
  
  // ✅ NUEVO: Metadata para categorías
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  href: string;
  image?: string;
  categoryId?: number;
  
  // ✅ NUEVO: Metadata para subcategorías
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
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
  sortBy?: 'price' | 'name' | 'rating' | 'newest' | 'popular' | 'discount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  
  // ✅ NUEVO: Para tracking
  addedAt: string;
  itemId: string; // ID único para cada item en el carrito
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
  helpful?: number;
  notHelpful?: number;
  
  // ✅ NUEVO: Para respuestas a reviews
  response?: {
    message: string;
    respondedAt: string;
    responderName: string;
  };
}

// ✅ NUEVOS TIPOS para funcionalidades avanzadas

export interface ProductVariant {
  id: number;
  productId: number;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface ProductComparison {
  products: Product[];
  attributes: string[];
}

export interface RecentlyViewed {
  product: Product;
  viewedAt: string;
}

// ✅ Tipos para analytics y tracking
export interface ProductView {
  productId: number;
  timestamp: string;
  duration: number;
  userId?: string;
}

export interface AddToCartEvent {
  productId: number;
  quantity: number;
  timestamp: string;
  variant?: {
    size?: string;
    color?: string;
  };
}

// ✅ Tipos para filtros avanzados
export interface FilterOption {
  id: string;
  name: string;
  value: string;
  count: number;
  selected: boolean;
}

export interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range' | 'color';
}

// ✅ Tipo para breadcrumbs
export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

// ✅ Tipo para pagination
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ✅ Tipo para imágenes mejoradas
export interface ProductImage {
  url: string;
  alt: string;
  type: 'main' | 'thumbnail' | 'gallery' | 'color' | 'detail';
  color?: string;
  order: number;
}

// ✅ Tipo para inventory management
export interface InventoryStatus {
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  expectedRestock?: string;
  backorder: boolean;
}

// ✅ Tipo para precios y descuentos
export interface PricingInfo {
  basePrice: number;
  salePrice?: number;
  currency: string;
  discountPercentage?: number;
  discountAmount?: number;
  onSale: boolean;
  saleEnds?: string;
}