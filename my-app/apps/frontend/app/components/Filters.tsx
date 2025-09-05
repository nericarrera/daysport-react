'use client';
import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  AdjustmentsHorizontalIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  SparklesIcon,
  FireIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { FilterState, FilterOptions, FiltersProps } from '../types/filters';
import { useDebounce } from '../hook/useDebounce';
import ActiveFilterChips from '../components/ActiveFilterChips';
import FilterSkeleton from '../components/FilterSkeleton';

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
  { id: '100-200', label: '$100 - $200' },
  { id: '200+', label: 'Más de $200' }
];

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
  className = '',
  productCounts 
}: FiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sizes: sizesOptions,
    colors: colorsOptions,
    brands: ['Nike', 'Adidas', 'Puma', 'Under Armour'],
    priceRanges: priceRanges,
    categories: []
  });
  
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
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

  const subcategories = subcategoriesMap[category] || [];

  // Efecto para búsqueda en tiempo real
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Aquí puedes agregar lógica de búsqueda
      console.log('Buscando:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  // Actualizar filtros locales cuando cambien los props
  useEffect(() => {
    if (selectedFilters) {
      setLocalFilters({
        ...selectedFilters,
        brands: selectedFilters.brands || []
      });
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
    const safeFilters = {
      ...newFilters,
      brands: newFilters.brands || []
    };
    setLocalFilters(safeFilters);
    if (onFilterChange) {
      onFilterChange(safeFilters);
    }
  };

  const handleRemoveFilter = (type: keyof FilterState, value?: string) => {
    if (type === 'subcategory' || type === 'priceRange') {
      handleFilterChange({ ...localFilters, [type]: '' });
    } else if (value && Array.isArray(localFilters[type])) {
      const newArray = (localFilters[type] as string[]).filter(item => item !== value);
      handleFilterChange({ ...localFilters, [type]: newArray });
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

  const handlePriceRangeChange = (rangeId: string) => {
    handleFilterChange({
      ...localFilters,
      priceRange: localFilters.priceRange === rangeId ? '' : rangeId
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
    const currentBrands = localFilters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    handleFilterChange({
      ...localFilters,
      brands: newBrands
    });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
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

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      {/* Barra superior de Filtros y Ordenamiento */}
      <div className={`sticky top-20 z-40 bg-white border-b border-gray-200 ${className}`}>
        <ActiveFilterChips 
          filters={localFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={clearAllFilters}
        />
        
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
          {/* Fondo semitransparente */}
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
              {/* Búsqueda */}
              <div className="mb-6">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {isLoadingOptions ? (
                <div className="space-y-6">
                  <FilterSkeleton />
                  <FilterSkeleton />
                  <FilterSkeleton />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Sección de Ordenamiento */}
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

                  {/* Sección de Subcategorías */}
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
                        {subcategories.map(subcat => (
                          <button
                            key={subcat}
                            onClick={() => handleSubcategoryChange(subcat)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex justify-between items-center ${
                              localFilters.subcategory === subcat
                                ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200'
                                : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                            }`}
                          >
                            <span>{capitalize(subcat)}</span>
                            {productCounts?.subcategories?.[subcat] && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {productCounts.subcategories[subcat]}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sección de Precios */}
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
                      <div className="px-4 pb-3 space-y-3">
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {priceRanges.map(range => (
                            <button
                              key={range.id}
                              onClick={() => handlePriceRangeChange(range.id)}
                              className={`py-2 px-3 text-sm rounded-md border transition-all ${
                                localFilters.priceRange === range.id
                                  ? 'bg-blue-100 text-blue-800 border-blue-300 font-medium'
                                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                              }`}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sección de Tallas */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleSection('sizes')}
                      className="w-full px-4 py-3 flex justify-between items-center text-left font-semibold text-gray-800 hover:bg-gray-50 rounded-t-lg"
                    >
                      <span>Tallas</span>
                      {expandedSections.sizes ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.sizes && (
                      <div className="px-4 pb-3">
                        <div className="grid grid-cols-3 gap-2">
                          {filterOptions.sizes.map(size => (
                            <button
                              key={size}
                              onClick={() => handleSizeChange(size)}
                              className={`py-2 px-3 border rounded-full text-sm flex items-center justify-center gap-1 ${
                                localFilters.sizes.includes(size)
                                  ? 'bg-black text-white border-black font-medium'
                                  : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {size}
                              {productCounts?.sizes?.[size] && (
                                <span className="text-xs opacity-70">({productCounts.sizes[size]})</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sección de Colores */}
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
                          {filterOptions.colors.map(color => (
                            <button
                              key={color}
                              onClick={() => handleColorChange(color)}
                              className={`py-2 px-3 border rounded-md text-sm flex items-center justify-between ${
                                localFilters.colors.includes(color)
                                  ? 'bg-blue-100 text-blue-800 border-blue-300 font-medium'
                                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <span>{color}</span>
                              {productCounts?.colors?.[color] && (
                                <span className="text-xs bg-gray-100 px-1 rounded">
                                  {productCounts.colors[color]}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sección de Marcas */}
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
                        {filterOptions.brands.map(brand => (
                          <label key={brand} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={localFilters.brands.includes(brand)}
                              onChange={() => handleBrandChange(brand)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 flex-1">{brand}</span>
                            {productCounts?.brands?.[brand] && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {productCounts.brands[brand]}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
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