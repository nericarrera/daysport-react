import ProductCard from './ProductCard';

export interface CompatibleProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string | null;  // ← Cambiado a null
  images: string[];
  description?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
}


interface ProductGridProps {
  products: CompatibleProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // ELIMINÉ la función normalizeProduct porque ya no es necesaria
  // Los productos ahora vienen en el formato correcto

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          No se encontraron productos en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}