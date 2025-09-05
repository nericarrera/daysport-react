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

export interface FiltersProps {
  category: string;
  onFilterChange?: (filters: FilterState) => void;
  onSortChange?: (sort: string) => void;
  selectedFilters?: FilterState;
  selectedSort?: string;
  isLoading?: boolean;
  className?: string;
  productCounts?: {
    sizes?: { [size: string]: number };
    colors?: { [color: string]: number };
    brands?: { [brand: string]: number };
    subcategories?: { [subcat: string]: number };
  };
}