// components/ProductCard.tsx - VERSIÓN CORREGIDA
import Image from 'next/image';
import Link from 'next/link';


export interface Product {
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

interface ProductCardProps {
  product: Product;
}



export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] || '/images/placeholder.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/producto/${product.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toLocaleString()}
            </span>
            
            <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors">
              Ver más
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}