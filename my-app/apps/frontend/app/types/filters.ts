// types/filters.ts
export interface FilterState {
  category: string;
  subcategory: string;
  priceRange: string;
  sizes: string[];
  colors: string[];
  brands: string[];
  [key: string]: any;
}

export interface FilterOptions {
  sizes: string[];
  colors: string[];
  brands: string[];
  priceRanges: { id: string; label: string }[];
  categories: string[];
}