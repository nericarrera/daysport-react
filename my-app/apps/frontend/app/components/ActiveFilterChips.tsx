'use client';
import { FilterState } from '../types/filters';

interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (type: keyof FilterState, value?: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilterChips({ filters, onRemoveFilter, onClearAll }: ActiveFilterChipsProps) {
  const hasActiveFilters = 
    filters.subcategory ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange;

  if (!hasActiveFilters) return null;

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 border-b">
      <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
      
      {filters.subcategory && (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          📁 {capitalize(filters.subcategory)}
          <button 
            onClick={() => onRemoveFilter('subcategory')}
            className="ml-1 text-blue-600 hover:text-blue-800 text-xs"
          >
            ×
          </button>
        </span>
      )}
      
      {filters.sizes.map(size => (
        <span key={size} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          📏 {size}
          <button 
            onClick={() => onRemoveFilter('sizes', size)}
            className="ml-1 text-green-600 hover:text-green-800 text-xs"
          >
            ×
          </button>
        </span>
      ))}
      
      {filters.colors.map(color => (
        <span key={color} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          🎨 {capitalize(color)}
          <button 
            onClick={() => onRemoveFilter('colors', color)}
            className="ml-1 text-purple-600 hover:text-purple-800 text-xs"
          >
            ×
          </button>
        </span>
      ))}
      
      {filters.brands.map(brand => (
        <span key={brand} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          🏷️ {brand}
          <button 
            onClick={() => onRemoveFilter('brands', brand)}
            className="ml-1 text-orange-600 hover:text-orange-800 text-xs"
          >
            ×
          </button>
        </span>
      ))}
      
      {filters.priceRange && (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          💰 {filters.priceRange.includes('+') ? `Más de $${filters.priceRange.replace('+', '')}` : filters.priceRange}
          <button 
            onClick={() => onRemoveFilter('priceRange')}
            className="ml-1 text-red-600 hover:text-red-800 text-xs"
          >
            ×
          </button>
        </span>
      )}
      
      <button
        onClick={onClearAll}
        className="text-gray-600 hover:text-red-600 text-sm font-medium ml-auto"
      >
        Limpiar todo
      </button>
    </div>
  );
}