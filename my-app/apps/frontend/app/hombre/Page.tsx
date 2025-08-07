
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { getProductsByCategory } from '../data/Products';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function HombrePage() {
  const products = getProductsByCategory('hombre');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs />
      
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ropa Deportiva para Hombre</h1>
        <p className="text-gray-600">Descubre nuestra colección diseñada para hombres activos</p>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Filters category="hombre" />
        </div>
        <div className="md:w-3/4">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}