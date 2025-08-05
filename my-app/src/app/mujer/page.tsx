import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { Products } from '../components/Products'; // Assuming this is where your products data is defined

export default function MujerPage() {
  const womenProducts = products.filter(product => product.category === 'mujer');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ropa Deportiva para Mujer</h1>
        <p className="text-gray-600">Descubre nuestra colección diseñada para mujeres activas</p>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros (sidebar en desktop) */}
        <div className="md:w-1/4">
          <Filters category="mujer" />
        </div>

        {/* Productos */}
        <div className="md:w-3/4">
          <ProductGrid product={womenProducts} />
        </div>
      </div>
    </div>
  );
}