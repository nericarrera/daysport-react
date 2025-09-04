'use client';
import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  AdjustmentsHorizontalIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  SparklesIcon,
  FireIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { FilterService, FilterOptions } from '../';

interface FiltersProps {
  category: string;
  onFilterChange?: (filters: FilterState) => void;
  onSortChange?: (sort: string) => void;
  selectedFilters?: FilterState;
  selectedSort?: string;
  isLoading?: boolean;
  className?: string;
}

export interface FilterState {
  category: string;
  subcategory: string;
  priceRange: string;
  sizes: string[];
  colors: string[];
  brands: string[];
  [key: string]: any;
}

const sortOptions = [
  { id: 'popularidad', label: 'Más vendidos', icon: FireIcon },
  { id: 'nuevo', label: 'Más nuevos', icon: SparklesIcon },
  { id: 'precio-asc', label: 'Precio: Menor a Mayor', icon: ArrowsUpDownIcon },
  { id: 'precio-desc', label: 'Precio: Mayor a Menor', icon: ArrowsUpDownIcon },
  { id: 'nombre-asc', label: 'Nombre: A-Z', icon: ArrowsUpDownIcon },
  { id: 'nombre-desc', label: 'Nombre: Z-A', icon: ArrowsUpDownIcon }
];

export default function Filters({ 
  category, 
  onFilterChange, 
  onSortChange,
  selectedFilters,
  selectedSort = 'popularidad',
  isLoading = false,
  className = '' 
}: FiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sizes: [],
    colors: [],
    brands: [],
    priceRanges: [],
    categories: []
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    sort: true,
    categories: true,
    price: true,
    sizes: true,
    colors: true,
    brands: true
  });

  const [localFilters, setLocalFilters] = useState<FilterState>(
    selectedFilters || {
      category: category,
      subcategory: '',
      priceRange: '',
      sizes: [],
      colors: [],
      brands: []
    }
  );

  // Cargar opciones de filtro desde el backend
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const options = await FilterService.getFilterOptions(category);
        setFilterOptions(options);
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadFilterOptions();
  }, [category]);

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

  const handleSortChange = (sortId: string) => {
    if (onSortChange) {
      onSortChange(sortId);
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
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand];
    
    handleFilterChange({
      ...localFilters,
      brands: newBrands
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      category: category,
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
    localFilters.brands.length
  ].reduce((a, b) => a + b, 0);

  // Función para capitalizar palabras
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Agrupar talles numéricos y alfabéticos
  const numericSizes = filterOptions.sizes.filter(size => /^\d+$/.test(size));
  const letterSizes = filterOptions.sizes.filter(size => !/^\d+$/.test(size));

  return (
    <>
      {/* Barra superior de Filtros y Ordenamiento */}
      <div className={`sticky top-20 z-40 bg-white border-b border-gray-200 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Botón de Filtros */}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading || isLoadingOptions}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white rounded-full font-medium hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span className="font-semibold">Filtros</span>
              {selectedFiltersCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                  {selectedFiltersCount}
                </span>
              )}
              {(isLoading || isLoadingOptions) && (
                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
            </button>

            {/* Selector de Ordenamiento */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Ordenar por:</span>
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                disabled={isLoading}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lateral tipo Drawer */}
      {isModalOpen && (
        <>
          {/* Fondo semitransparente con animación */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Drawer lateral */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out">
            {/* Header del drawer */}
            <div className="bg-gradient-to-r from-gray-900 to-black px-4 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Filtros Avanzados</h3>
                <p className="text-gray-300 text-sm">Categoría: {capitalize(category)}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 p-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Contenido del drawer */}
            <div className="h-[calc(100%-120px)] overflow-y-auto p-4 bg-gray-50">
              {isLoadingOptions ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Sección de Ordenamiento dentro del drawer */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleSection('sort')}
                      className="w-full px-4 py-3 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 rounded-t-lg"
                    >
                      <span className="flex items-center gap-2">
                        <ArrowsUpDownIcon className="h-4 w-4" />
                        Ordenar por
                      </span>
                      {expandedSections.sort ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.sort && (
                      <div className="px-4 pb-3 space-y-2">
                        {sortOptions.map(option => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.id}
                              onClick={() => handleSortChange(option.id)}
                              className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                                selectedSort === option.id
                                  ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200'
                                  : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

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
                        {filterOptions.categories.map((subcat) => (
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
                        {filterOptions.priceRanges.map((range) => (
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

                  {/* Sección de Talles - Dividida en Numéricos y Alfabéticos */}
                  {filterOptions.sizes.length > 0 && (
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
                          {/* Talles Alfabéticos */}
                          {letterSizes.length > 0 && (
                            <>
                              <h5 className="font-medium text-gray-700 mb-2">Talles Alfabéticos</h5>
                              <div className="grid grid-cols-3 gap-2 mb-4">
                                {letterSizes.map((size) => (
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
                            </>
                          )}

                          {/* Talles Numéricos */}
                          {numericSizes.length > 0 && (
                            <>
                              <h5 className="font-medium text-gray-700 mb-2">Talles Numéricos</h5>
                              <div className="grid grid-cols-4 gap-2">
                                {numericSizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => handleSizeChange(size)}
                                    className={`px-2 py-2 rounded-md border text-sm transition-all duration-200 ${
                                      localFilters.sizes.includes(size) 
                                        ? 'bg-black text-white border-black font-medium' 
                                        : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Secciones de Colores y Marcas (similar a las anteriores) */}
                  {/* ... (mantener el mismo formato que las secciones anteriores) */}
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