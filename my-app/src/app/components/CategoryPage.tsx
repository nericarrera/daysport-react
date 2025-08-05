import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';

interface CategoryPageProps {
  title: string;
  description: string;
  category: string;
}

export default function CategoryPage({ 
  title, 
  description, 
  category 
}: CategoryPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros (sidebar en desktop) */}
        <div className="md:w-1/4">
          <Filters category={category} />
        </div>

        {/* Productos */}
        <div className="md:w-3/4">
          <ProductGrid category={category} />
        </div>
      </div>
    </div>
  );
}