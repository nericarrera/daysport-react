'use client';
import { use } from 'react'; // ← AGREGAR ESTA IMPORTACIÓN
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import FilterButton from '../components/FilterButton';
import { ChevronLeftIcon, HomeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Importamos el servicio de productos que conecta con la API
import { ProductService } from '../../services/productService';
import { Product } from '../types/product';

// Datos de las categorías circulares PARA HOMBRE
const subcategories = [
  {
    name: 'Buzos',
    slug: 'buzos',
    image: '/menu-seccion-img/hombre/menu-buzos.jpg'
  },
  {
    name: 'Camperas',
    slug: 'camperas',
    image: '/menu-seccion-img/hombre/menu-camperas.jpg'
  },
  {
    name: 'Conjuntos',
    slug: 'conjuntos',
    image: '/menu-seccion-img/hombre/menu-conjuntos.jpg'
  },
  {
    name: 'Deportes',
    slug: 'deportes',
    image: '/menu-seccion-img/hombre/menu-deportes.jpg'
  },
  {
    name: 'Remeras',
    slug: 'remeras',
    image: '/menu-seccion-img/hombre/menu-remeras.jpg'
  },
  {
    name: 'Shorts',
    slug: 'shorts', 
    image: '/menu-seccion-img/hombre/menu-shorts.jpg'
  },
  {
    name: 'Pantalones',
    slug: 'pantalones',
    image: '/menu-seccion-img/hombre/menu-pantalones.jpg'
  },
  {
    name: 'Sweaters',
    slug: 'sweaters',
    image: '/menu-seccion-img/hombre/menu-sweaters.jpg'
  }
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

// SOLO UNA FUNCIÓN HombrePage - CORREGIDA
export default function HombrePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ subcategory?: string }>  // ← AGREGAR Promise
}) {
  // Desempaqueta los searchParams con use()
  const resolvedSearchParams = use(searchParams);
  
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    resolvedSearchParams.subcategory || ''  // ← USAR valor desempaquetado
  );
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // AGREGAR este useEffect para los parámetros de URL - ACTUALIZADO
  useEffect(() => {
    if (resolvedSearchParams.subcategory) {  // ← USAR resolvedSearchParams
      setSelectedSubcategory(resolvedSearchParams.subcategory);
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
  }, [resolvedSearchParams.subcategory]);  // ← DEPENDENCIA ACTUALIZADA

  // Función para cargar productos con manejo de errores mejorado
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Cargando productos de hombre...');
      
      const productsData = await ProductService.getProductsByCategory('hombre');
      console.log('🎯 Productos desde el servicio:', productsData);
      
      // ✅ VERSIÓN CORREGIDA - Manejo seguro de tipos
      const productsArray = getProductsArray(productsData);
      
      setAllProducts(productsArray);
      setFilteredProducts(productsArray);
      
    } catch (err) {
      console.error('💥 Error completo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los productos';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Función para recargar productos
  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  // Filtrar productos cuando cambia la subcategoría seleccionada
  useEffect(() => {
    if (selectedSubcategory === '') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => 
        product.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [selectedSubcategory, allProducts]);

  // DEBUG: Ver productos en consola (solo en desarrollo) - AMPLIADO
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Todos los productos:', allProducts);
      console.log('🔍 Productos filtrados:', filteredProducts);
      console.log('🎯 Subcategoría seleccionada:', selectedSubcategory);
      
      // ✅ DEBUG ESPECÍFICO PARA IMÁGENES
      if (allProducts.length > 0) {
        console.log('🖼️ === DEBUG DETALLADO DE IMÁGENES ===');
        
        allProducts.forEach((product, index) => {
          console.log(`📦 Producto ${index + 1}:`, {
            id: product.id,
            name: product.name,
            mainImage: product.mainImage,
            mainImageUrl: product.mainImageUrl,
            images: product.images,
            hasMainImage: !!product.mainImage,
            hasMainImageUrl: !!product.mainImageUrl,
            hasImages: !!product.images?.length,
            category: product.category,
            subcategory: product.subcategory
          });
        });

        // Probar la primera imagen
        const firstProduct = allProducts[0];
        if (firstProduct?.mainImageUrl) {
          console.log('🌐 URL para probar en navegador:', firstProduct.mainImageUrl);
          console.log('🔗 ¿Es URL absoluta?', firstProduct.mainImageUrl.startsWith('http'));
        }

        // Verificar tipos de datos
        console.log('🔎 Tipos de datos - Primer producto:');
        console.log('   mainImage:', typeof firstProduct?.mainImage, firstProduct?.mainImage);
        console.log('   mainImageUrl:', typeof firstProduct?.mainImageUrl, firstProduct?.mainImageUrl);
        console.log('   images:', Array.isArray(firstProduct?.images) ? 'Array' : typeof firstProduct?.images);
      } else {
        console.log('❌ No hay productos para debuggear');
      }
    }
  }, [allProducts, filteredProducts, selectedSubcategory]);

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
    <div className="max-w-full mx-auto px-4 py-14 bg-white min-h-screen">
      {/* Breadcrumbs y Botón de Regreso */}
      <div className="flex items-center gap-4 mb-6">
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
          {selectedSubcategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium capitalize">
                {selectedSubcategory}
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
        <h1 className="text-4xl font-bold text-gray-900 mb-1">ROPA DEPORTIVA PARA HOMBRE +</h1>
        <p className="text-gray-600">DESCUBRE NUESTRA COLECCIÓN DISEÑADA PARA HOMBRES ACTIVOS</p>
        
        {/* Contador de productos en el header */}
        <div className="mt-4 flex items-center gap-4">
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {compatibleProducts.length} {compatibleProducts.length === 1 ? 'producto' : 'productos'}
          </span>
          {refreshing && (
            <span className="text-sm text-gray-500 flex items-center">
              <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
              Actualizando...
            </span>
          )}
        </div>
      </div>

      {/* Sección de Categorías Circulares */}
      <div className="mb-12 overflow-x-auto">
        <div className="flex space-x-8 pb-4">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.slug}
              onClick={() => setSelectedSubcategory(
                selectedSubcategory === subcategory.slug ? '' : subcategory.slug
              )}
              className={`flex flex-col items-center group min-w-[80px] transition-all ${
                selectedSubcategory === subcategory.slug 
                  ? 'scale-110 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-pressed={selectedSubcategory === subcategory.slug}
            >
              <div className={`rounded-full overflow-hidden w-20 h-20 md:w-24 md:h-24 border-2 transition-all duration-300 ${
                selectedSubcategory === subcategory.slug 
                  ? 'border-gray-900 shadow-lg ring-2 ring-blue-100' 
                  : 'border-gray-200 group-hover:border-gray-400 group-hover:shadow-md'
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


      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros */}
        <div className="md:w-1/4">
          <div className="sticky top-4 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <span className="mr-2">⚙️</span>
                Filtros
              </h3>
              
              {/* Botón de filtro con funcionalidad completa */}
              <FilterButton 
                category="hombre"
                onFilterChange={setSelectedSubcategory}
              />
              
              {/* Mostrar filtro activo */}
              {selectedSubcategory && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-800">
                    Filtro activo: 
                    <span className="ml-2 capitalize font-bold">
                      {selectedSubcategory}
                    </span>
                  </p>
                  <button 
                    onClick={() => setSelectedSubcategory('')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline flex items-center"
                  >
                    Limpiar filtro
                  </button>
                </div>
              )}
            </div>

            {/* Contador de productos */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center border border-gray-100">
              <p className="text-2xl font-bold text-gray-800">
                {compatibleProducts.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {compatibleProducts.length === 1 ? 'producto' : 'productos'} 
                {selectedSubcategory ? ` en ${selectedSubcategory}` : ' disponibles'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Productos - AGREGAR ID PARA EL SCROLL */}
        <div className="md:w-3/4" id="productos">
          {compatibleProducts.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedSubcategory 
                    ? `Productos en ${selectedSubcategory}` 
                    : 'Todos los productos de hombre'
                  }
                  <span className="text-gray-500 ml-2 text-base font-normal">
                    ({compatibleProducts.length})
                  </span>
                </h2>
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
                {selectedSubcategory 
                  ? `Prueba con otra subcategoría o limpia los filtros`
                  : 'No hay productos en la categoría hombre aún'
                }
              </p>
              {selectedSubcategory ? (
                <button 
                  onClick={() => setSelectedSubcategory('')}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Ver todos los productos
                </button>
              ) : (
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center mx-auto"
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Reintentar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}