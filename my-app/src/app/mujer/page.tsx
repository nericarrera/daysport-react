import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import FilterButton from '../components/FilterButton';
import { getProductsByCategory } from '../data/Products';
import { ChevronLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';


// Datos de las categorías circulares
const subcategories = [
  {
    name: 'Remeras',
    slug: 'remeras',
    image: '/menu-seccion-img/mujer/menu-remeras.jpg'
  },
  {
    name: 'Joggins',
    slug: 'joggins',
    image: '/menu-seccion-img/mujer/menu-pantalones.webp'
  },
  {
    name: 'Buzos',
    slug: 'buzos',
    image: '/menu-seccion-img/mujer/menu-buzos.jpg'
  },
  {
    name: 'Camperas',
    slug: 'camperas',
    image: '/menu-seccion-img/mujer/menu-camperas.jpg'
  },
  {
    name: 'Shorts',
    slug: 'shorts',
    image: '/menu-seccion-img/mujer/menu-shorts.webp'
  },
  {
    name: 'Calzas',
    slug: 'calzas',
    image: '/menu-seccion-img/mujer/menu-calzas.jpg'
  }
];

export default function MujerPage() {
  const products = getProductsByCategory('mujer');

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
            href="/mujer" 
            className="hover:text-yellow-400 transition-colors font-medium"
          >
            Mujer
          </Link>
        </div>
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">ROPA DEPORTIVA PARA MUJER +</h1>
        <p className="text-gray-600">DESCUBRE NUESTRA COLECCIÓN DISEÑADA PARA MUJERES ACTIVAS</p>
      </div>

      {/* Sección de Categorías Circulares */}
      <div className="mb-12 overflow-x-auto">
        <div className="flex space-x-8 pb-4">
          {subcategories.map((subcategory) => (
            <Link 
              key={subcategory.slug} 
              href={`/mujer/${subcategory.slug}`}
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
  <FilterButton category="mujer" />
</div>
        
        {/* Productos */}
        <div className="md:w-3/4">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}