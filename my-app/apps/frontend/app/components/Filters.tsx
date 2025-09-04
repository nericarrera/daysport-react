'use client';
import { useState, useEffect } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FiltersProps {
  category: string;
  onFilterChange?: (filters: FilterState) => void;
  selectedFilters?: FilterState;
  // Nuevas props para personalización y conexión con backend
  filterOptions?: FilterOptions;
  isLoading?: boolean;
  className?: string;
}

export interface FilterState {
  subcategory: string;
  priceRange: string;
  sizes: string[];
  colors: string[];
  brands?: string[];
  [key: string]: any; // Para filtros adicionales
}

interface FilterOptions {
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  priceRanges?: { id: string; label: string }[];
  // Puedes agregar más opciones según lo que devuelva tu backend
}

// Mapeo de subcategorías por categoría principal
const subcategoriesMap: { [key: string]: string[] } = {
  mujer: ['remeras', 'shorts', 'calzas', 'buzos', 'zapatillas'],
  hombre: ['remeras', 'shorts', 'bermudas', 'buzos', 'zapatillas'],
  niños: ['remeras', 'shorts', 'conjuntos', 'zapatillas'],
  accesorios: ['hidratacion', 'medias', 'gorras', 'mochilas']
};

// Valores por defecto
const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const defaultColors = ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Gris', 'Rosa'];
const defaultPriceRanges = [
  { id: '0-25', label: 'Menos de $25' },
  { id: '25-50', label: '$25 - $50' },
  { id: '50-100', label: '$50 - $100' },
  { id: '100-200', label: '$100 - $200' },
  { id: '200+', label: 'Más de $200' }
];

export default function Filters({ 
  category, 
  onFilterChange, 
  selectedFilters, 
  filterOptions,
  isLoading = false,
  className = '' 
}: FiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    categories: true,
    price: true,
    sizes: true,
    colors: true,
    brands: true
  });
  
  // Usar opciones del backend o las por defecto
  const sizesOptions = filterOptions?.sizes || defaultSizes;
  const colorsOptions = filterOptions?.colors || defaultColors;
  const priceRangesOptions = filterOptions?.priceRanges || defaultPriceRanges;
  const brandsOptions = filterOptions?.brands || [];

  const [localFilters, setLocalFilters] = useState<FilterState>(
    selectedFilters || {
      subcategory: '',
      priceRange: '',
      sizes: [],
      colors: [],
      brands: []
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const handleBrandChange = (brand: string) => {
    const newBrands = localFilters.brands?.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...(localFilters.brands || []), brand];
    
    handleFilterChange({
      ...localFilters,
      brands: newBrands
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      subcategory: '',
      priceRange: '',
      sizes: [],
      colors: [],
      brands: []
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
    localFilters.colors.length,
    localFilters.brands?.length || 0
  ].reduce((a, b) => a + b, 0);

  // Función para capitalizar palabras
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      {/* Botón para abrir el modal de filtros - MEJORADO */}
      <div className={`sticky top-20 z-30 bg-white py-3 border-b border-gray-200 ${className}`}>
        <div className="container mx-auto px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-full font-medium hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span className="font-semibold">Filtrar Productos</span>
            {selectedFiltersCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                {selectedFiltersCount}
              </span>
            )}
            {isLoading && (
              <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
          </button>
        </div>
      </div>

      {/* Modal Lateral tipo Drawer - TOTALMENTE PERSONALIZABLE */}
      {isModalOpen && (
        <>
          {/* Fondo semitransparente con animación */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Drawer lateral con animación */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out">
            {/* Header del drawer */}
            <div className="bg-gradient-to-r from-gray-900 to-black px-4 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Filtros Avanzados</h3>
                <p className="text-gray-300 text-sm">Encuentra lo que buscas</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 p-1 rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Cerrar filtros"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Contenido del drawer con scroll */}
            <div className="h-[calc(100%-120px)] overflow-y-auto p-4 bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Sección de Categorías */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleSection('categories')}
                      className="w-full px-4 py-3 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 rounded-t-lg"
                    >
                      <span>Categorías</span>
                      {expandedSections.categories ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.categories && (
                      <div className="px-4 pb-3 space-y-2">
                        <button
                          onClick={() => handleSubcategoryChange('')}
                          className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
                            !localFilters.subcategory 
                              ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200' 
                              : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                          }`}
                        >
                          Todas las categorías
                        </button>
                        {subcategories.map((subcat) => (
                          <button
                            key={subcat}
                            onClick={() => handleSubcategoryChange(subcat)}
                            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
                              localFilters.subcategory === subcat 
                                ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200' 
                                : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                            }`}
                          >
                            {capitalize(subcat)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sección de Precio */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleSection('price')}
                      className="w-full px-4 py-3 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 rounded-t-lg"
                    >
                      <span>Rango de Precio</span>
                      {expandedSections.price ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.price && (
                      <div className="px-4 pb-3 space-y-2">
                        {priceRangesOptions.map((range) => (
                          <button
                            key={range.id}
                            onClick={() => handlePriceRangeChange(range.id)}
                            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
                              localFilters.priceRange === range.id 
                                ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200' 
                                : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sección de Talles */}
                  {sizesOptions.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <button
                        onClick={() => toggleSection('sizes')}
                        className="w-full px-4 py-3 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 rounded-t-lg"
                      >
                        <span>Talles</span>
                        {expandedSections.sizes ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </button>
                      {expandedSections.sizes && (
                        <div className="px-4 pb-3">
                          <div className="grid grid-cols-3 gap-2">
                            {sizesOptions.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeChange(size)}
                                className={`px-3 py-2 rounded-md border text-sm transition-all duration-200 ${
                                  localFilters.sizes.includes(size) 
                                    ? 'bg-black text-white border-black font-medium' 
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sección de Colores */}
                  {colorsOptions.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <button
                        onClick={() => toggleSection('colors')}
                        className="w-full px-4 py-3 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 rounded-t-lg"
                      >
                        <span>Colores</span>
                        {expandedSections.colors ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </button>
                      {expandedSections.colors && (
                        <div className="px-4 pb-3">
                          <div className="grid grid-cols-2 gap-2">
                            {colorsOptions.map((color) => (
                              <button
                                key={color}
                                onClick={() => handleColorChange(color)}
                                className={`px-3 py-2 rounded-md border text-sm transition-all duration-200 ${
                                  localFilters.colors.includes(color) 
                                    ? 'border-blue-500 bg-blue-50 text-blue-800 font-medium' 
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sección de Marcas (si hay datos) */}
                  {brandsOptions.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <button
                        onClick={() => toggleSection('brands')}
                        className="w-full px-4 py-3 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 rounded-t-lg"
                      >
                        <span>Marcas</span>
                        {expandedSections.brands ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </button>
                      {expandedSections.brands && (
                        <div className="px-4 pb-3 space-y-2">
                          {brandsOptions.map((brand) => (
                            <button
                              key={brand}
                              onClick={() => handleBrandChange(brand)}
                              className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
                                localFilters.brands?.includes(brand) 
                                  ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200' 
                                  : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                              }`}
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer del drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 flex justify-between border-t border-gray-200 shadow-lg">
              <button
                onClick={clearAllFilters}
                className="text-gray-600 hover:text-red-600 font-medium py-2 px-4 rounded-md hover:bg-red-50 transition-all duration-200 border border-gray-300"
                disabled={selectedFiltersCount === 0}
              >
                Limpiar todo
              </button>
              <button
                onClick={applyFilters}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-md font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}