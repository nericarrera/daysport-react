'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Product } from '../types/product';

// ✅ AGREGAR METADATA - Esto ayuda a Next.js a reconocer la ruta
export const metadata = {
  title: 'Mis Favoritos - DaySport',
  description: 'Tus productos favoritos en DaySport',
};

export default function FavoritosPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('favoriteProducts');
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites);
          setFavoriteProducts(favorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

    // Escuchar eventos de actualización de favoritos desde otros componentes
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
  }, []);

  const removeFromFavorites = (productId: number) => {
    const updatedFavorites = favoriteProducts.filter(product => product.id !== productId);
    setFavoriteProducts(updatedFavorites);
    
    // Guardar en localStorage
    localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
    
    // Disparar evento para sincronizar otros componentes
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  const clearAllFavorites = () => {
    setFavoriteProducts([]);
    localStorage.removeItem('favoriteProducts');
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
        </div>
        
        {favoriteProducts.length > 0 && (
          <button
            onClick={clearAllFavorites}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1 border border-gray-300 rounded-md hover:border-red-300"
          >
            Limpiar todos
          </button>
        )}
      </div>

      {/* Contenido */}
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
            <HeartIcon className="h-12 w-12 text-pink-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No tienes favoritos aún</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Guarda tus productos favoritos para encontrarlos fácilmente más tarde.
          </p>
          <Link
            href="/hombre"
            className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-flex items-center gap-2"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            Explorar productos
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto' : 'productos'} favorito{favoriteProducts.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={clearAllFavorites}
              className="text-sm text-red-600 hover:text-red-800 transition-colors font-medium"
            >
              Eliminar todos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group">
                <Link href={`/producto/${product.id}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={product.images?.[0] || product.mainImageUrl || '/placeholder-product.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/producto/${product.id}`} className="block flex-1">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeFromFavorites(product.id)}
                      className="text-pink-600 hover:text-pink-800 transition-colors ml-2 p-1"
                      title="Quitar de favoritos"
                    >
                      <HeartIcon className="h-6 w-6 fill-current" />
                    </button>
                  </div>

                  <p className="text-lg font-bold text-green-600 mb-2">${product.price}</p>
                  
                  {product.category && (
                    <p className="text-sm text-gray-600 capitalize mb-3">
                      {product.category}
                      {product.subcategory && ` • ${product.subcategory}`}
                    </p>
                  )}

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(Math.round(product.rating))}
                        {'☆'.repeat(5 - Math.round(product.rating))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.rating.toFixed(1)})
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/producto/${product.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Ver producto
                    </Link>
                    <button
                      onClick={() => removeFromFavorites(product.id)}
                      className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:border-red-300 hover:text-red-600 transition-colors text-sm"
                      title="Quitar de favoritos"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}