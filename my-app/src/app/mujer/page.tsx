import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { getProductsByCategory } from '../data/Products';
import { ChevronLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function MujerPage() {
  const products = getProductsByCategory('mujer');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs y Botón de Regreso */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/" 
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Volver al inicio"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          <HomeIcon className="h-5 w-5" />
        </Link>
        
        <div className="flex items-center text-sm text-gray-500">
          <span className="mx-2">/</span>
          <Link 
            href="/mujer" 
            className="hover:text-gray-900 transition-colors font-medium"
          >
            Mujer
          </Link>
          {/* Si tuvieras subcategorías como "remeras" */}
          {/* <span className="mx-2">/</span>
          <span className="text-gray-700">Remeras</span> */}
        </div>
      </div>

      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ropa Deportiva para Mujer</h1>
        <p className="text-gray-600">Descubre nuestra colección diseñada para mujeres activas</p>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros */}
        <div className="md:w-1/4">
          <Filters category="mujer" />
        </div>
        
        {/* Productos */}
        <div className="md:w-3/4">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}