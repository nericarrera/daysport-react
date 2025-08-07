export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  // ... otras propiedades
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
}