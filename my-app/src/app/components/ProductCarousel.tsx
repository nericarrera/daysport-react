'use client';
import Image from 'next/image';
import { useCart } from './CartContext';
import Carousel from './Carousel';

export default function ProductCarousel({ title, products }) {
  const { addToCart } = useCart();

  return (
    <Carousel
      title={title}
      items={products}
      itemsToShow={4}
      renderItem={(product) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow mx-2">
          <div className="relative h-48">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-600 mb-3">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      )}
    />
  );
}