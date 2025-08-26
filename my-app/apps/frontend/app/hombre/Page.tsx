'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import FilterButton from '../components/FilterButton';
import { ChevronLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Importamos el servicio de productos que conecta con la API
import { ProductService } from '../../services/productService';
import { Product } from '../types/product';

// Datos de las categorías circulares PARA HOMBRE
const subcategories = [
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
    name: 'Pantalones',
    slug: 'pantalones',
    image: '/menu-seccion-img/hombre/menu-pantalones.jpg'
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    image: '/menu-seccion-img/hombre/menu-accesorios.jpg'
  }
];

export default function HombrePage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    async function loadProducts() {
      try {
        console.log('🔄 Cargando productos de hombre...');
        
        const productsData = await ProductService.getProductsByCategory('hombre');
        console.log('🎯 Productos desde el servicio:', productsData);
        
        // ✅ VERSIÓN CORREGIDA - Manejo seguro de tipos
        const productsArray = getProductsArray(productsData);
        
        setAllProducts(productsArray);
        setFilteredProducts(productsArray);
        
      } catch (err) {
        console.error('💥 Error completo:', err);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  // Filtrar productos cuando cambia la subcategoría seleccionada
  useEffect(() => {
    if (selectedSubcategory === '') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => 
        product.subcategory === selectedSubcategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedSubcategory, allProducts]);

  // DEBUG: Ver productos en consola
  useEffect(() => {
    console.log('📊 Todos los productos:', allProducts);
    console.log('🔍 Productos filtrados:', filteredProducts);
    console.log('🎯 Subcategoría seleccionada:', selectedSubcategory);
  }, [allProducts, filteredProducts, selectedSubcategory]);

  const compatibleProducts = filteredProducts;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full mx-auto px-4 py-14 bg-white">
        <div className="text-center py-20">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <p className="text-gray-600">
            Asegúrate de que el backend esté corriendo en otra terminal con: 
            <code className="bg-gray-100 p-1 rounded ml-2">npm run start:dev</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 py-14 bg-white">
      {/* Breadcrumbs y Botón de Regreso */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/" 
          className="flex items-center text-gray-600 hover:text-purple-700 transition-colors"
          aria-label="Volver al inicio"
        >
          <ChevronLeftIcon className="h-6 w-6 mr-1" />
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
        </div>
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">ROPA DEPORTIVA PARA HOMBRE +</h1>
        <p className="text-gray-600">DESCUBRE NUESTRA COLECCIÓN DISEÑADA PARA HOMBRES ACTIVOS</p>
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
                  : 'text-gray-600'
              }`}
            >
              <div className={`rounded-full overflow-hidden w-20 h-20 md:w-24 md:h-24 border-2 transition-all duration-300 ${
                selectedSubcategory === subcategory.slug 
                  ? 'border-gray-900 shadow-lg' 
                  : 'border-gray-200 group-hover:border-gray-400'
              }`}>
                <Image
                  src={subcategory.image || '/placeholder-category.jpg'}
                  alt={subcategory.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-category.jpg';
                  }}
                />
              </div>
              <span className="mt-2 text-sm font-medium transition-colors">
                {subcategory.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Información de debug (solo desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-yellow-800">DEBUG Info:</h3>
          <p>Productos totales: {allProducts.length}</p>
          <p>Productos filtrados: {filteredProducts.length}</p>
          <p>Subcategoría activa: {selectedSubcategory || 'Ninguna'}</p>
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros */}
        <div className="md:w-1/4">
          <div className="sticky top-4 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-4">Filtros</h3>
              
              {/* Botón de filtro con funcionalidad completa */}
              <FilterButton 
                category="hombre"
                onFilterChange={setSelectedSubcategory}
              />
              
              {/* Mostrar filtro activo */}
              {selectedSubcategory && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Filtro activo: 
                    <span className="ml-2 capitalize font-bold">
                      {selectedSubcategory}
                    </span>
                  </p>
                  <button 
                    onClick={() => setSelectedSubcategory('')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Limpiar filtro
                  </button>
                </div>
              )}
            </div>

            {/* Contador de productos */}
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <p className="text-lg font-semibold text-gray-800">
                {compatibleProducts.length}
              </p>
              <p className="text-sm text-gray-600">
                {compatibleProducts.length === 1 ? 'producto' : 'productos'} encontrado
                {selectedSubcategory && ` en ${selectedSubcategory}`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Productos */}
        <div className="md:w-3/4">
          {compatibleProducts.length > 0 ? (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedSubcategory 
                    ? `Productos en ${selectedSubcategory}` 
                    : 'Todos los productos de hombre'
                  }
                </h2>
              </div>
              <ProductGrid products={compatibleProducts} />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No se encontraron productos</p>
              <p className="text-gray-400">
                {selectedSubcategory 
                  ? `Prueba con otra subcategoría o limpia los filtros`
                  : 'No hay productos en la categoría hombre aún'
                }
              </p>
              {selectedSubcategory && (
                <button 
                  onClick={() => setSelectedSubcategory('')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Ver todos los productos
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}