import { Product } from '../data/Products';
import Image from 'next/image';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="border rounded-lg overflow-hidden">
          {/* Renderizar cada producto */}
          <Image 
          src={product.image} 
          alt={product.name} 
          width={400}
          height={400}
          className="w-full h-auto"/>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}