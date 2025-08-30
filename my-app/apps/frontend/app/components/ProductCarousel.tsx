'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from './Carousel';
import { useCart } from './CartContext';

// Actualiza la interfaz para que coincida con el backend
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  image?: string;
  category?: string;
  rating?: number;
  inStock?: boolean;
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Evita la navegación
    e.stopPropagation(); // Evita que se propague al link
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
    });
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4">{title}</h2>
      <Carousel
        title={title}
        items={products}
        itemsToShow={4}
        renderItem={(product: Product) => (
          <Link 
            href={`/producto/${product.id}`} // ← REDIRIGE A PÁGINA DE PRODUCTO
            className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 mx-2 group border border-gray-100"
          >
            {/* Contenedor de imagen */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Overlay de hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-opacity duration-300" />
              
              {/* Badges */}
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
              
              {!product.inStock && (
                <div className="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Agotado
                </div>
              )}
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              
              {/* Precio */}
              <div className="flex items-center gap-2 mb-2">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <>
                    <span className="text-lg font-bold text-green-600">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(Math.round(product.rating))}
                    {'☆'.repeat(5 - Math.round(product.rating))}
                  </div>
                  <span className="text-xs text-gray-600 ml-2">
                    ({product.rating.toFixed(1)})
                  </span>
                </div>
              )}

              {/* Botón de agregar al carrito - SOLO EN HOVER */}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
              >
                Agregar al carrito
              </button>
            </div>
          </Link>
        )}
      />
    </section>
  );
}