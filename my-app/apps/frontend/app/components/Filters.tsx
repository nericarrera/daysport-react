'use client';
import { useState, useEffect } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

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

  // Evitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

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
      <div className="sticky top-20 z-30 bg-white py-3 border-b border-gray-200">
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

      {/* Modal Lateral tipo Drawer - VERSIÓN MEJORADA */}
      {isModalOpen && (
        <>
          {/* Fondo semitransparente */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Drawer lateral */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out">
            {/* Header del drawer */}
            <div className="bg-gray-50 px-4 py-4 flex justify-between items-center border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Cerrar filtros"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Contenido del drawer con scroll */}
            <div className="h-[calc(100%-120px)] overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Categorías */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Categorías</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSubcategoryChange('')}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                        !localFilters.subcategory 
                          ? 'bg-gray-100 font-medium text-black border border-gray-300' 
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      Todas las categorías
                    </button>
                    {subcategories.map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => handleSubcategoryChange(subcat)}
                        className={`block w-full text-left px-3 py-2 rounded-md capitalize transition-colors ${
                          localFilters.subcategory === subcat 
                            ? 'bg-gray-100 font-medium text-black border border-gray-300' 
                            : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                        }`}
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
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          localFilters.priceRange === range.id 
                            ? 'bg-gray-100 font-medium text-black border border-gray-300' 
                            : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                        }`}
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
                        className={`px-3 py-2 rounded-md border text-sm transition-colors flex-1 min-w-[45px] ${
                          localFilters.sizes.includes(size) 
                            ? 'bg-black text-white border-black' 
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
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
                        className={`px-3 py-2 rounded-md border text-sm transition-colors flex-1 min-w-[70px] ${
                          localFilters.colors.includes(color) 
                            ? 'border-black font-medium bg-gray-100' 
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-50 px-4 py-4 flex justify-between border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                Limpiar todo
              </button>
              <button
                onClick={applyFilters}
                className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}