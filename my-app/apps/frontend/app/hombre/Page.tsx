'use client';
import { use } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import { ChevronLeftIcon, HomeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Filters, { FilterState } from '../components/Filters';

// Importamos el servicio de productos que conecta con la API
import { ProductService } from '../../services/productService';
import { Product } from '../types/product';

type ProductFilterParams = {
  category: string;
  subcategory?: string;
  sizes?: string | string[];
  colors?: string | string[];
  brands?: string | string[];
  limit?: number;
  [key: string]: any;
};

// Datos de las categorías circulares PARA HOMBRE
const subcategories = [
  {name: 'Buzos', slug: 'buzos', image: '/menu-seccion-img/hombre/menu-buzos.jpg'},
  {name: 'Camperas', slug: 'camperas', image: '/menu-seccion-img/hombre/menu-camperas.jpg'},
  {name: 'Conjuntos', slug: 'conjuntos', image: '/menu-seccion-img/hombre/menu-conjuntos.jpg'},
  {name: 'Deportes', slug: 'deportes', image: '/menu-seccion-img/hombre/menu-deportes.jpg'},
  {name: 'Remeras', slug: 'remeras', image: '/menu-seccion-img/hombre/menu-remeras.jpg'},
  {name: 'Shorts', slug: 'shorts', image: '/menu-seccion-img/hombre/menu-shorts.jpg'},
  {name: 'Pantalones', slug: 'pantalones', image: '/menu-seccion-img/hombre/menu-pantalones.jpg'},
  {name: 'Sweaters', slug: 'sweaters', image: '/menu-seccion-img/hombre/menu-sweaters.jpg'}
];

// Función helper para obtener productos de diferentes formatos de respuesta
function getProductsArray(data: unknown): Product[] {
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data && typeof data === 'object') {
    const response = data as Record<string, unknown>;
    
    if (Array.isArray(response.products)) {
      return response.products as Product[];
    }
    if (Array.isArray(response.data)) {
      return response.data as Product[];
    }
    if (Array.isArray(response.items)) {
      return response.items as Product[];
    }
  }
  
  return [];
}

// Función para normalizar colores (convierte cualquier formato a array de strings)
function normalizeColors(colors: unknown): string[] {
  if (!colors) return [];
  
  if (Array.isArray(colors)) {
    return colors.map(color => {
      if (typeof color === 'string') return color.toLowerCase();
      return String(color).toLowerCase();
    });
  }
  
  if (typeof colors === 'string') {
    if (colors.includes(',')) {
      return colors.split(',').map(c => c.trim().toLowerCase());
    }
    return [colors.toLowerCase()];
  }
  
  return [String(colors).toLowerCase()];
}

// Función para aplicar filtros a los productos
function applyFilters(products: Product[], filters: FilterState): Product[] {
  if (!filters) return products;
  
  return products.filter(product => {
    // Filtrar por subcategoría
    if (filters.subcategory && product.subcategory?.toLowerCase() !== filters.subcategory.toLowerCase()) {
      return false;
    }
    
    // Filtrar por rango de precio
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      const productPrice = product.price || 0;
      
      if (filters.priceRange.endsWith('+')) {
        if (productPrice < min) return false;
      } else if (productPrice < min || productPrice > max) {
        return false;
      }
    }
    
    // Filtrar por talles (con verificación de existencia)
    if (filters.sizes.length > 0 && product.sizes && Array.isArray(product.sizes)) {
      const hasMatchingSize = filters.sizes.some(size => 
        product.sizes!.includes(size)
      );
      if (!hasMatchingSize) return false;
    }
    
    // Filtrar por colores (con verificación de existencia)
    if (filters.colors.length > 0 && product.colors) {
      const productColors = normalizeColors(product.colors);
      const hasMatchingColor = filters.colors.some(filterColor => {
        const normalizedFilterColor = filterColor.toLowerCase();
        return productColors.some(productColor => 
          productColor.includes(normalizedFilterColor)
        );
      });
      
      if (!hasMatchingColor) return false;
    }
    
    return true;
  });
}

// Construir filtros para backend - CORREGIDO
function buildBackendFilters(filters: FilterState): ProductFilterParams {
  return {
    category: 'hombre', // obligatorio
    subcategory: filters.subcategory || undefined,
    sizes: filters.sizes.length ? filters.sizes.join(',') : undefined,
    colors: filters.colors.length ? filters.colors.join(',') : undefined,
    priceRange: filters.priceRange || undefined,
  };
}

export default function HombrePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ subcategory?: string }>
}) {
  // Desempaqueta los searchParams con use()
  const resolvedSearchParams = use(searchParams);
  
  // ✅ CORRECCIÓN: Incluir category en el estado inicial
  const [filters, setFilters] = useState<FilterState>({
    category: 'hombre', // ✅ Añadido
    subcategory: resolvedSearchParams.subcategory || '',
    priceRange: '',
    sizes: [],
    colors: [],
    brands: [] // ✅ Añadido para consistencia
  });
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [backendMode, setBackendMode] = useState(true);

  // Actualizar filtros cuando cambien los parámetros de URL
  useEffect(() => {
    if (resolvedSearchParams.subcategory) {
      setFilters(prev => ({
        ...prev,
        subcategory: resolvedSearchParams.subcategory || ''
      }));
      
      // Scroll automático a los productos después de un breve delay
      setTimeout(() => {
        const productsSection = document.getElementById('productos');
        if (productsSection) {
          productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300);
    }
  }, [resolvedSearchParams.subcategory]);

  // Función para cargar productos con manejo de errores mejorado
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Cargando productos de hombre...');
      
      let productsData;
      
      if (backendMode) {
        // Modo backend: usar filtros en el servidor
        const params = buildBackendFilters(filters);
        // ✅ Ahora params incluye category, así que es compatible
        productsData = await ProductService.getProductsWithFilters(params);
      } else {
        // Modo local: traer todos y filtrar en cliente
        productsData = await ProductService.getProductsByCategory('hombre');
      }
      
      console.log('🎯 Productos desde el servicio:', productsData);
      
      const productsArray = getProductsArray(productsData);
      setAllProducts(productsArray);
      
    } catch (err) {
      console.error('💥 Error completo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los productos';
      setError(errorMessage);
      
      // Si falla el backend, cambiar a modo local
      if (backendMode) {
        console.log('🔄 Cambiando a modo de filtrado local...');
        setBackendMode(false);
        try {
          const localData = await ProductService.getProductsByCategory('hombre');
          const localArray = getProductsArray(localData);
          setAllProducts(localArray);
        } catch (localError) {
          console.error('💥 Error también en modo local:', localError);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, backendMode]);

  // Cargar productos al montar el componente o cambiar filtros
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Aplicar filtros locales cuando no esté en modo backend
  useEffect(() => {
    if (!backendMode) {
      const filtered = applyFilters(allProducts, filters);
      setFilteredProducts(filtered);
    } else {
      // En modo backend, los productos ya vienen filtrados
      setFilteredProducts(allProducts);
    }
  }, [allProducts, filters, backendMode]);

  // Función para recargar productos
  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  // Toggle entre modo backend y local
  const toggleBackendMode = () => {
    setBackendMode(!backendMode);
    setRefreshing(true);
  };

  // ✅ CORRECCIÓN: Función para limpiar filtros que incluya category
  const clearAllFilters = () => {
    setFilters({
      category: 'hombre', // ✅ Mantener la categoría
      subcategory: '',
      priceRange: '',
      sizes: [],
      colors: [],
      brands: []
    });
  };

  const compatibleProducts = filteredProducts;

  // Estado de carga mejorado
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 text-lg">Cargando productos...</p>
        <p className="text-sm text-gray-400 mt-2">Conectando con el servidor</p>
      </div>
    );
  }

  // Manejo de errores mejorado
  if (error && allProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar productos</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="bg-gray-100 p-4 rounded-lg text-left mb-6">
            <p className="text-sm font-medium mb-2">Solución:</p>
            <code className="text-xs bg-white p-2 rounded block">
              npm run start:dev
            </code>
            <p className="text-xs text-gray-500 mt-1">Ejecuta este comando en la carpeta del backend</p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center mx-auto"
          >
            {refreshing ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
            ) : null}
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-mediun mx-auto px-4 py-14 bg-white min-h-screen">
      {/* Breadcrumbs y Botón de Regreso */}
      <div className="flex items-center gap-4 mb-6 justify-center">
        <Link 
          href="/" 
          className="flex items-center text-gray-600 hover:text-purple-700 transition-colors group"
          aria-label="Volver al inicio"
        >
          <ChevronLeftIcon className="h-6 w-6 mr-1 group-hover:-translate-x-1 transition-transform" />
          <HomeIcon className="h-6 w-6" />
        </Link>
        
        <div className="flex items-center text-sm text-gray-500">
          <span className="mx-2">/</span>
          <Link 
            href="/hombre" 
            className="hover:text-yellow-400 transition-colors font-medium"
          >
            Hombre
          </Link>
          {filters.subcategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium capitalize">
                {filters.subcategory}
              </span>
            </>
          )}
        </div>

        {/* Botón de recarga */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="ml-auto flex items-center text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
          title="Recargar productos"
        >
          <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="ml-1 text-sm">Actualizar</span>
        </button>
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">ROPA PARA HOMBRE +</h1>
        <p className="text-gray-600">DESCUBRE NUESTRA COLECCIÓN DISEÑADA PARA HOMBRES ACTIVOS</p>
        
        {/* Contador de productos en el header */}
        <div className="mt-4 flex items-center gap-4">
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {compatibleProducts.length} {compatibleProducts.length === 1 ? 'producto' : 'productos'}
          </span>
          
          {/* Indicador de modo */}
          <span className={`text-xs px-2 py-1 rounded-full ${
            backendMode 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {backendMode ? 'Backend' : 'Local'}
          </span>
          
          {refreshing && (
            <span className="text-sm text-gray-500 flex items-center">
              <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
              Actualizando...
            </span>
          )}
        </div>

        {/* Toggle modo backend/local */}
        <div className="mt-2 flex items-center">
          <span className="text-sm text-gray-600 mr-2">Modo de filtrado:</span>
          <button
            onClick={toggleBackendMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              backendMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                backendMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="ml-2 text-sm text-gray-600">
            {backendMode ? 'Servidor' : 'Navegador'}
          </span>
        </div>
      </div>

      {/* Sección de Categorías Circulares */}
      <div className="h-auto mb-12 overflow-x-auto text-center">
        <div className="flex space-x-8 pb-4 justify-center">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.slug}
              onClick={() => setFilters(prev => ({
                ...prev,
                subcategory: prev.subcategory === subcategory.slug ? '' : subcategory.slug
              }))}
              className={`flex flex-col items-center group min-w-[90px] transition-all justify-center cursor-pointer ${
                filters.subcategory === subcategory.slug 
                  ? 'scale-110 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-pressed={filters.subcategory === subcategory.slug}
            >
              <div className={`rounded-full overflow-hidden w-20 h-20 md:w-24 md:h-24 border-2 transition-all duration-300 ${
                filters.subcategory === subcategory.slug 
                  ? 'border-gray-900 shadow-lg ring-2 ring-blue-100' 
                  : 'border-gray-200 group-hover:border-yellow-400 group-hover:shadow-md'
              }`}>
                <Image
                  src={subcategory.image || '/placeholder-category.jpg'}
                  alt={subcategory.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-category.jpg';
                  }}
                />
              </div>
              <span className="mt-2 text-sm font-medium transition-colors text-center">
                {subcategory.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Filtro tipo Adidas (modal) */}
      <Filters 
        category="hombre" 
        onFilterChange={setFilters}
        selectedFilters={filters}
      />

      {/* Contenido */}
      <div className="mt-8">
        {/* Productos */}
        <div id="productos">
          {compatibleProducts.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {filters.subcategory 
                    ? `Productos en ${filters.subcategory}` 
                    : 'Todos los productos de hombre'
                  }
                  <span className="text-gray-500 ml-2 text-base font-normal">
                    ({compatibleProducts.length})
                  </span>
                </h2>
                
                {/* Mostrar filtros activos */}
                {(filters.priceRange || filters.sizes.length > 0 || filters.colors.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {filters.priceRange && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Precio: {filters.priceRange.includes('+') ? `Más de $${filters.priceRange.replace('+', '')}` : `$${filters.priceRange}`}
                      </span>
                    )}
                    {filters.sizes.map(size => (
                      <span key={size} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Talle: {size}
                      </span>
                    ))}
                    {filters.colors.map(color => (
                      <span key={color} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        Color: {color}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ProductGrid products={compatibleProducts} />
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <div className="text-gray-400 text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg font-medium mb-2">
                No se encontraron productos
              </p>
              <p className="text-gray-400 mb-6">
                {filters.subcategory || filters.priceRange || filters.sizes.length > 0 || filters.colors.length > 0
                  ? `Prueba con otros filtros o limpia los filtros actuales`
                  : 'No hay productos en la categoría hombre aún'
                }
              </p>
              <button 
                onClick={clearAllFilters} // ✅ Usar la función corregida
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}