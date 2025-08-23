
'use client';

import React from 'react';
import Image from 'next/image';
import Carousel from './Carousel';
import { useCart } from './CartContext';

// Actualiza la interfaz para que coincida con el backend
interface Product {
  id: number;        // ← Cambiado a number para coincidir con Prisma
  name: string;
  price: number;
  images: string[];  // ← Cambiado a plural (array)
  image?: string;    // ← Opcional por compatibilidad
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const { addToCart } = useCart();

  return (
    <Carousel
      title={title}
      items={products}
      itemsToShow={4}
      renderItem={(product: Product) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow mx-2">
          <div className="relative h-48">
            <Image
              src={product.images?.[0] || '/placeholder.jpg'} // ← Toma la primera imagen
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-600 mb-3">${product.price}</p>
            <button
              onClick={() => addToCart({
                id: String(product.id), // Convertir a string para el carrito
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '', // ← Pasar la primera imagen
              })}
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