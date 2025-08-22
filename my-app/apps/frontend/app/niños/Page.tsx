'use client';
import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import FilterButton from '../components/FilterButton';
import { getProductsByCategory, convertToCompatibleProducts } from '../data/Products';
import { ChevronLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';

// Datos de las categorías circulares PARA NIÑOS
const subcategories = [
  {
    name: 'Remeras',
    slug: 'remeras',
    image: '/menu-seccion-img/niños/menu-remeras.jpg'
  },
  {
    name: 'Shorts', 
    slug: 'shorts',
    image: '/menu-seccion-img/niños/menu-shorts.jpg'
  },
  {
    name: 'Buzos',
    slug: 'buzos',
    image: '/menu-seccion-img/niños/menu-buzos.jpg'
  },
  {
    name: 'Conjuntos',
    slug: 'conjuntos',
    image: '/menu-seccion-img/niños/menu-conjuntos.jpg'
  },
  {
    name: 'Pantalones',
    slug: 'pantalones',
    image: '/menu-seccion-img/niños/menu-pantalones.jpg'
  },
  {
    name: 'Zapatillas',
    slug: 'zapatillas',
    image: '/menu-seccion-img/niños/menu-zapatillas.jpg'
  }
];

export default function NiñosPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const allProducts = getProductsByCategory('niños');
  
  // Filtrar productos según la subcategoría seleccionada
  const filteredProducts = allProducts.filter(product => 
    selectedSubcategory === '' || product.subcategory === selectedSubcategory
  );

  const compatibleProducts = convertToCompatibleProducts(filteredProducts);

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
            href="/niños" 
            className="hover:text-yellow-400 transition-colors font-medium"
          >
            Niños
          </Link>
        </div>
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">ROPA DEPORTIVA PARA NIÑOS +</h1>
        <p className="text-gray-600">DIVERSIÓN Y COMODIDAD PARA LOS MÁS PEQUEÑOS</p>
      </div>

      {/* Sección de Categorías Circulares */}
      <div className="mb-12 overflow-x-auto">
        <div className="flex space-x-8 pb-4">
          {subcategories.map((subcategory) => (
            <Link 
              key={subcategory.slug} 
              href={`/niños/${subcategory.slug}`}
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
              
              {/* Botón de filtro con funcionalidad completa */}
              <FilterButton 
                category="niños"  // ← CAMBIADO a "niños"
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
          <ProductGrid products={compatibleProducts} />
        </div>
      </div>
    </div>
  );
}