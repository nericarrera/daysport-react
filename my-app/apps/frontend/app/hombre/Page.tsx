import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import FilterButton from '../components/FilterButton';
import { getProductsByCategory, convertToCompatibleProducts } from '../data/Products';
import { ChevronLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

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
  const oldProducts = getProductsByCategory('hombre');
  const compatibleProducts = convertToCompatibleProducts(oldProducts);

  return (
    <div className="max-w-full mx-auto px-43 py-14 bg-white">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="flex items-center text-gray-600 hover:text-purple-700">
          <ChevronLeftIcon className="h-6 w-6 mr-1" />
          <HomeIcon className="h-6 w-6" />
        </Link>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mx-2">/</span>
          <Link href="/hombre" className="hover:text-yellow-400 font-medium">
            Hombre
          </Link>
        </div>
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">ROPA DEPORTIVA PARA HOMBRE +</h1>
        <p className="text-gray-600">DESCUBRE NUESTRA COLECCIÓN DISEÑADA PARA HOMBRES ACTIVOS</p>
      </div>

      {/* Categorías Circulares */}
      <div className="mb-12 overflow-x-auto">
        <div className="flex space-x-8 pb-4">
          {subcategories.map((subcategory) => (
            <Link key={subcategory.slug} href={`/hombre/${subcategory.slug}`} className="flex flex-col items-center group min-w-[80px]">
              <div className="rounded-full overflow-hidden w-20 h-20 md:w-24 md:h-24 border-2 border-gray-200 group-hover:border-gray-900 transition-all">
                <Image src={subcategory.image} alt={subcategory.name} width={96} height={96} className="object-cover w-full h-full" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {subcategory.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <FilterButton category="hombre" />
        </div>
        <div className="md:w-3/4">
          <ProductGrid products={compatibleProducts} />
        </div>
      </div>
    </div>
  );
}