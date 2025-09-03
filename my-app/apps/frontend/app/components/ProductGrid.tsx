'use client';
import ProductCard from './ProductCard';
import { Product } from '../types/product';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-900 text-lg">
          No se encontraron productos en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="grid gap-4 w-full"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(263px, 1fr))'
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}