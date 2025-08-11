import { Product } from '../data/Products';
import Image from 'next/image';

interface ProductGridProps {
  products?: Product[]; 
  category: string;     
}

export default function ProductGrid({ products = [], category }: ProductGridProps) {
  // Filtrar productos si hay datos
  const filteredProducts = products.length > 0
    ? products.filter(product => product.category === category)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden">
            <Image 
              src={product.image} 
              alt={product.name} 
              width={400}
              height={400}
              className="w-full h-auto"
            />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No hay productos para esta categoría.
        </p>
      )}
    </div>
  );
}