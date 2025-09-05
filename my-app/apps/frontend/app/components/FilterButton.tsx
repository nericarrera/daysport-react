'use client';
import { useState, useEffect, useRef} from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface FilterButtonProps {
  category: string;
  onFilterChange?: (subcategory: string) => void;
  
}



const subcategoriesMap: { [key: string]: string[] } = {
  mujer: ['remeras', 'shorts', 'calzas', 'buzos', 'camperas'],
  hombre: ['remeras', 'shorts', 'buzos', 'camperas', 'pantalones', 'accesorios'],
  niños: ['remeras', 'shorts', 'conjuntos', 'zapatillas'],
  accesorios: ['hidratacion', 'medias', 'gorras', 'mochilas']
};

export default function FilterButton({ category, onFilterChange }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const subcategories = subcategoriesMap[category] || [];

  const handleFilterSelect = (subcategory: string) => {
    setSelectedFilter(subcategory);
    setIsOpen(false);
    if (onFilterChange) {
      onFilterChange(subcategory);
    }
  };

  const clearFilter = () => {
    setSelectedFilter('');
    if (onFilterChange) {
      onFilterChange('');
    }
  };

  // ✅ CORREGIDO: Cerrar el dropdown al hacer clic fuera
  const handleClickOutside = (e: React.MouseEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <span>Filtrar</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
      </button>

      {selectedFilter && (
        <div className="mt-2 bg-gray-100 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
          <span className="capitalize">{selectedFilter}</span>
          <button onClick={clearFilter} className="text-red-600 hover:text-red-800">
            ×
          </button>
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="p-3">
            <h3 className="font-semibold mb-2">Filtrar por</h3>
            
            <button
              onClick={() => handleFilterSelect('')}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 ${
                selectedFilter === '' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
              }`}
            >
              Todos los productos
            </button>

            {subcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => handleFilterSelect(subcat)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 ${
                  selectedFilter === subcat ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                <span className="capitalize">{subcat}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}