'use client';
import React from 'react';
import Image from 'next/image';
import Carousel from './Carousel';
import { useCart } from './CartContext';

// Asegúrate de que esta interfaz coincida con lo que espera addToCart
interface Product {
  id: string; // Cambiado a solo string para coincidir con CartItem
  name: string;
  price: number;
  image: string;
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
              src={product.image}
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
                ...product,
                // Asegúrate de que el objeto cumple con Omit<CartItem, "quantity">
                // Si necesitas transformar el ID a string:
                id: String(product.id)
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