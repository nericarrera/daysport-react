import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { getProductsByCategory } from '../data/Products';

export default function MujerPage() {
  const products = getProductsByCategory('mujer');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Ropa para Mujer</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Filters category="mujer" />
        </div>
        <div className="md:w-3/4">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}