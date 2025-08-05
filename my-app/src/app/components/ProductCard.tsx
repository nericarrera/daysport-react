import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../Types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/mujer/${product.slug}`}>
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
          <p className="text-gray-600 mb-3">${product.price.toLocaleString('es-AR')}</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
            Ver Detalles
          </button>
        </div>
      </Link>
    </div>
  );
}