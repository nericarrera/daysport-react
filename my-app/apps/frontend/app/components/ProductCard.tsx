'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { Product } from '../types/product';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
  priority?: boolean;
}

// Mapa de colores optimizado
const COLOR_MAP: Record<string, string> = {
  'negro': '#000000', 'blanco': '#ffffff', 'rojo': '#ff0000',
  'azul': '#0000ff', 'verde': '#00ff00', 'gris': '#808080',
  'amarillo': '#ffff00', 'rosa': '#ffc0cb', 'morado': '#800080',
  'naranja': '#ffa500', 'marron': '#a52a2a', 'beige': '#f5f5dc',
  'azul marino': '#000080', 'verde oscuro': '#006400', 'cyan': '#00ffff',
  'magenta': '#ff00ff', 'plateado': '#c0c0c0', 'dorado': '#ffd700',
  'turquesa': '#40e0d0', 'lavanda': '#e6e6fa', 'coral': '#ff7f50',
  'ocre': '#cc7722', 'vino': '#722f37'
};

export default function ProductCard({ product, showNewBadge = false, priority = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ Memoizar cálculos costosos
  const { hasDiscount, discountPercentage, isNew, isOutOfStock } = useMemo(() => {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount 
      ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
      : 0;

    const isNew = showNewBadge && product.createdAt 
      ? (Date.now() - new Date(product.createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000)
      : false;

    const isOutOfStock = product.stock === 0 || !product.inStock;

    return { hasDiscount, discountPercentage, isNew, isOutOfStock };
  }, [product, showNewBadge]);

  // ✅ URL de imagen memoizada
  const imageSrc = useMemo(() => {
    return imageError 
      ? '/images/placeholder.jpg' 
      : (product.mainImageUrl || product.mainImage || '/images/placeholder.jpg');
  }, [imageError, product.mainImageUrl, product.mainImage]);

  // ✅ Manejo de favoritos optimizado
  const toggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const saved = localStorage.getItem('favoriteProducts');
      const favorites: Product[] = saved ? JSON.parse(saved) : [];
      
      const newFavorites = isFavorite
        ? favorites.filter(fav => fav.id !== product.id)
        : [...favorites, product];
      
      localStorage.setItem('favoriteProducts', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [isFavorite, product]);

  // ✅ Efecto para favoritos
  useEffect(() => {
    const checkFavorite = () => {
      try {
        const saved = localStorage.getItem('favoriteProducts');
        if (saved) {
          const favorites: Product[] = JSON.parse(saved);
          setIsFavorite(favorites.some(fav => fav.id === product.id));
        }
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    };

    checkFavorite();
    window.addEventListener('favoritesUpdated', checkFavorite);
    return () => window.removeEventListener('favoritesUpdated', checkFavorite);
  }, [product.id]);

  // ✅ Obtener la primera imagen de color si existe
  const getColorImage = useCallback((color: string) => {
    if (product.colorImages && product.colorImages[color] && product.colorImages[color].length > 0) {
      return product.colorImages[color][0];
    }
    return null;
  }, [product.colorImages]);

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Badges superpuestos */}
      <div className="absolute top-2 left-2 z-20 flex flex-col space-y-1">
        {isNew && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            🆕 NUEVO
          </span>
        )}
        {hasDiscount && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            🔥 -{discountPercentage}%
          </span>
        )}
        {product.featured && !hasDiscount && !isNew && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            ⭐ DESTACADO
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            🔒 AGOTADO
          </span>
        )}
      </div>

      {/* Botón de favoritos */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 z-20 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors group/favorite"
        title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {isFavorite ? (
          <HeartSolid className="h-5 w-5 text-pink-600 group-hover/favorite:scale-110 transition-transform" />
        ) : (
          <HeartOutline className="h-5 w-5 text-gray-400 hover:text-pink-400 group-hover/favorite:scale-110 transition-transform" />
        )}
      </button>

      <Link 
        href={`/producto/${product.slug || product.id}`} 
        className="block relative flex-grow"
        aria-label={`Ver detalles de ${product.name}`}
      >
        {/* Imagen del producto */}
        <div className="relative h-48 w-full overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse z-0"></div>
          )}
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 z-10"
            unoptimized={true}
            priority={priority}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
          )}
        </div>

        {/* Contenido de la tarjeta - MÁS SIMPLIFICADO */}
        <div className="p-4 flex-grow">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-violet-700 transition-colors min-h-[3rem]">
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="text-sm text-gray-500 mb-1 font-medium">
              {product.brand}
            </p>
          )}

          {/* Categoría */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="capitalize">{product.category}</span>
            {product.subcategory && (
              <>
                <span className="mx-1">•</span>
                <span className="capitalize">{product.subcategory}</span>
              </>
            )}
          </div>

          {/* Precio */}
          <div className="mb-3">
            {hasDiscount ? (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-800">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-red-500 line-through">
                  ${product.originalPrice!.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* ✅ COLORES CON IMÁGENES */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color: string, index: number) => {
                  const colorImage = getColorImage(color);
                  return (
                    <div
                      key={index}
                      className="relative w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm overflow-hidden group/color"
                      title={color.charAt(0).toUpperCase() + color.slice(1)}
                    >
                      {/* Mostrar imagen del color si existe, sino mostrar círculo de color */}
                      {colorImage ? (
                        <Image
                          src={colorImage}
                          alt={`${product.name} - Color ${color}`}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      ) : (
                        <div 
                          className="w-full h-full"
                          style={{ backgroundColor: COLOR_MAP[color.toLowerCase()] || '#f0f0f0' }}
                        />
                      )}
                      {/* Tooltip en hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/color:bg-opacity-20 transition-opacity" />
                    </div>
                  );
                })}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500 self-center">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ✅ ENVÍO GRATIS (se mantiene porque es una ventaja promocional) */}
          {product.price > 50 && !isOutOfStock && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                🚚 Envío gratis
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Botones de acción */}
      <div className="px-4 pb-4 mt-auto">
        <AddToCartButton 
          product={product} 
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
            isOutOfStock 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
          }`}
        />
        
        {!isOutOfStock && (
          <button 
            onClick={toggleFavorite}
            className="w-full mt-2 text-xs text-gray-600 hover:text-pink-600 transition-colors flex items-center justify-center gap-1 py-1"
          >
            {isFavorite ? (
              <>
                <HeartSolid className="h-4 w-4 text-pink-600" />
                Quitar favorito
              </>
            ) : (
              <>
                <HeartOutline className="h-4 w-4" />
                Agregar favorito
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}