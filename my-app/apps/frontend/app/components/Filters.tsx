'use client';
import { useState, useEffect } from 'react';
import { XMarkIcon, FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface FiltersProps {
  category: string;
  onFilterChange?: (filters: FilterState) => void;
  selectedFilters?: FilterState;
}

export interface FilterState {
  subcategory: string;
  priceRange: string;
  sizes: string[];
  colors: string[];
}

// Mapeo de subcategorías por categoría principal
const subcategoriesMap: { [key: string]: string[] } = {
  mujer: ['remeras', 'shorts', 'calzas', 'buzos', 'zapatillas'],
  hombre: ['remeras', 'shorts', 'bermudas', 'buzos', 'zapatillas'],
  niños: ['remeras', 'shorts', 'conjuntos', 'zapatillas'],
  accesorios: ['hidratacion', 'medias', 'gorras', 'mochilas']
};

// Opciones de talles, colores y rangos de precio
const sizesOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colorsOptions = ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Gris', 'Rosa'];
const priceRanges = [
  { id: '0-25', label: 'Menos de $25' },
  { id: '25-50', label: '$25 - $50' },
  { id: '50-100', label: '$50 - $100' },
  { id: '100+', label: 'Más de $100' }
];

export default function Filters({ category, onFilterChange, selectedFilters }: FiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(
    selectedFilters || {
      subcategory: '',
      priceRange: '',
      sizes: [],
      colors: []
    }
  );

  const subcategories = subcategoriesMap[category] || [];

  // Actualizar filtros locales cuando cambien los props
  useEffect(() => {
    if (selectedFilters) {
      setLocalFilters(selectedFilters);
    }
  }, [selectedFilters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSubcategoryChange = (subcategory: string) => {
    handleFilterChange({
      ...localFilters,
      subcategory: localFilters.subcategory === subcategory ? '' : subcategory
    });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    handleFilterChange({
      ...localFilters,
      priceRange: localFilters.priceRange === priceRange ? '' : priceRange
    });
  };

  const handleSizeChange = (size: string) => {
    const newSizes = localFilters.sizes.includes(size)
      ? localFilters.sizes.filter(s => s !== size)
      : [...localFilters.sizes, size];
    
    handleFilterChange({
      ...localFilters,
      sizes: newSizes
    });
  };

  const handleColorChange = (color: string) => {
    const newColors = localFilters.colors.includes(color)
      ? localFilters.colors.filter(c => c !== color)
      : [...localFilters.colors, color];
    
    handleFilterChange({
      ...localFilters,
      colors: newColors
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      subcategory: '',
      priceRange: '',
      sizes: [],
      colors: []
    };
    handleFilterChange(clearedFilters);
  };

  const applyFilters = () => {
    setIsModalOpen(false);
  };

  const selectedFiltersCount = [
    localFilters.subcategory ? 1 : 0,
    localFilters.priceRange ? 1 : 0,
    localFilters.sizes.length,
    localFilters.colors.length
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Botón para abrir el modal de filtros */}
      <div className="sticky top-20 z-10 bg-white py-3 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            Filtrar
            {selectedFiltersCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {selectedFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Modal de filtros */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Fondo del modal */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Contenido del modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Header del modal */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Cuerpo del modal */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Categorías */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Categorías</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSubcategoryChange('')}
                        className={`block w-full text-left px-3 py-2 rounded-md ${!localFilters.subcategory ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                      >
                        Todas las categorías
                      </button>
                      {subcategories.map((subcat) => (
                        <button
                          key={subcat}
                          onClick={() => handleSubcategoryChange(subcat)}
                          className={`block w-full text-left px-3 py-2 rounded-md capitalize ${localFilters.subcategory === subcat ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                        >
                          {subcat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rango de precios */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Rango de precios</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => handlePriceRangeChange(range.id)}
                          className={`block w-full text-left px-3 py-2 rounded-md ${localFilters.priceRange === range.id ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Talles */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Talles</h4>
                    <div className="flex flex-wrap gap-2">
                      {sizesOptions.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(size)}
                          className={`px-3 py-1.5 rounded-md border ${localFilters.sizes.includes(size) ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-gray-400'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colores */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Colores</h4>
                    <div className="flex flex-wrap gap-2">
                      {colorsOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`px-3 py-1.5 rounded-md border ${localFilters.colors.includes(color) ? 'border-black font-medium' : 'border-gray-300 hover:border-gray-400'}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer del modal */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between border-t border-gray-200">
                <button
                  onClick={clearAllFilters}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Limpiar todo
                </button>
                <button
                  onClick={applyFilters}
                  className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}