
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import FilterButton from '../components/FilterButton';
import { ChevronLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Importamos el servicio de productos
import { ProductService } from '../../services/productService';
import { Product } from '../types/product';

// Datos de las categorías circulares PARA ACCESORIOS
const subcategories = [
  {
    name: 'Hidratación',
    slug: 'hidratacion',
    image: '/menu-seccion-img/accesorios/menu-hidratacion.jpg'
  },
  {
    name: 'Medias', 
    slug: 'medias',
    image: '/menu-seccion-img/accesorios/menu-medias.jpg'
  },
  {
    name: 'Gorras',
    slug: 'gorras',
    image: '/menu-seccion-img/accesorios/menu-gorras.jpg'
  },
  {
    name: 'Mochilas',
    slug: 'mochilas',
    image: '/menu-seccion-img/accesorios/menu-mochilas.jpg'
  },
  {
    name: 'Guantes',
    slug: 'guantes',
    image: '/menu-seccion-img/accesorios/menu-guantes.jpg'
  },
  {
    name: 'Cinturones',
    slug: 'cinturones',
    image: '/menu-seccion-img/accesorios/menu-cinturones.jpg'
  }
];

export default function AccesoriosPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar productos desde la API
  useEffect(() => {
    async function loadProducts() {
      try {
        console.log('🔄 Cargando productos de accesorios...');
        
        // Usar el servicio
        const productsData = await ProductService.getProductsByCategory('accesorios');
        console.log('🎯 Productos desde el servicio:', productsData);
        
        setAllProducts(productsData);
        setFilteredProducts(productsData);
        
      } catch (err) {
        console.error('💥 Error completo:', err);
        setError('Error al cargar los productos. Verifica que el backend esté corriendo en http://localhost:3001');
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
      <div className="max-w-full mx-auto px-43 py-14 bg-white">
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
    <div className="max-w-full mx-auto px-43 py-14 bg-white">
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
            href="/accesorios" 
            className="hover:text-yellow-400 transition-colors font-medium"
          >
            Accesorios
          </Link>
        </div>
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">ACCESORIOS DEPORTIVOS +</h1>
        <p className="text-gray-600">COMPLEMENTA TU ENTRENAMIENTO CON LOS MEJORES ACCESORIOS</p>
      </div>

      {/* Sección de Categorías Circulares */}
      <div className="mb-12 overflow-x-auto">
        <div className="flex space-x-8 pb-4">
          {subcategories.map((subcategory) => (
            <Link 
              key={subcategory.slug} 
              href={`/accesorios/${subcategory.slug}`}
              className="flex flex-col items-center group min-w-[80px]"
            >
              <div className="rounded-full overflow-hidden w-20 h-20 md:w-24 md:h-24 border-2 border-gray-200 group-hover:border-gray-900 transition-all duration-300">
                <Image
                  src={subcategory.image}
                  alt={subcategory.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {subcategory.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros */}
        <div className="md:w-1/4">
          <div className="sticky top-4 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-4">Filtros</h3>
              
              <FilterButton 
                category="accesorios"
                onFilterChange={setSelectedSubcategory}
              />
              
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
        
        <div className="md:w-3/4">
          {compatibleProducts.length > 0 ? (
            <ProductGrid products={compatibleProducts} />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No se encontraron productos</p>
              <p className="text-gray-400">Prueba con otro filtro o categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}