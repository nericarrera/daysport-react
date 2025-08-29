'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '../types/product';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
}

// Mapa de colores fuera del componente para mejor rendimiento
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

export default function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Debug solo en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const imgUrl = product.mainImageUrl || product.mainImage;
      console.log('🔍 IMAGE DEBUG:', {
        url: imgUrl,
        exists: !!imgUrl,
        isExternal: imgUrl?.includes('http'),
        isLocalhost: imgUrl?.includes('localhost')
      });
    }
  }, [product]);

  const getColorHex = useCallback((color: string): string => {
    return COLOR_MAP[color.toLowerCase()] || '#f0f0f0';
  }, []);

  // Memoizar cálculos costosos
  const { hasDiscount, discountPercentage, isNew, isOutOfStock } = useMemo(() => {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount 
      ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
      : 0;

    const isNew = showNewBadge && product.createdAt 
      ? (new Date().getTime() - new Date(product.createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000)
      : false;

    const isOutOfStock = (product.stockQuantity === 0 || !product.inStock);

    return { hasDiscount, discountPercentage, isNew, isOutOfStock };
  }, [product, showNewBadge]);

  // Determinar el estado de stock
  const stockStatus = useMemo(() => {
    if (isOutOfStock) return { text: '❌ Agotado', color: 'text-red-600' };
    
    if (product.stockQuantity && product.stockQuantity > 10) {
      return { text: '✅ Disponible', color: 'text-green-600' };
    }
    
    return { 
      text: `⚠️ Últimas ${product.stockQuantity} unidades`, 
      color: 'text-orange-600' 
    };
  }, [isOutOfStock, product.stockQuantity]);

  // URL de la imagen con fallback
  const imageSrc = useMemo(() => {
    return imageError 
      ? '/images/placeholder.jpg' 
      : (product.mainImageUrl || product.mainImage || '/images/placeholder.jpg');
  }, [imageError, product.mainImageUrl, product.mainImage]);

  // Manejo de errores de imagen
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Badges superpuestos */}
      <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
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

      <Link 
        href={`/producto/${product.id}`} 
        className="block relative flex-grow"
        aria-label={`Ver detalles de ${product.name}`}
      >
        {/* Imagen del producto con skeleton loading */}
   <div className="relative h-48 w-full overflow-hidden">
  {imageLoading && (
    <div className="absolute inset-0 bg-gray-200 animate-pulse z-0"></div> // ← z-0 en lugar de z-10
  )}
  <Image
    src={imageSrc}
    alt={product.name}
    fill
    className="object-cover group-hover:scale-105 transition-transform duration-300 z-10"
    unoptimized={true}
    onError={handleImageError}
    onLoad={handleImageLoad}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
          
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4 flex-grow">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-violet-700 transition-colors min-h-[3rem]">
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="text-sm text-gray-500 mb-1 font-medium">
              {product.brand}
            </p>
          )}

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
                <span className="text-xl font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice!.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.rating.toFixed(1)})
              </span>
              {product.reviewCount && (
                <span className="text-sm text-gray-500 ml-2">
                  ({product.reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          {/* Colores */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Colores disponibles:</p>
              <div className="flex gap-2">
                {product.colors.slice(0, 5).map((color: string, index: number) => (
                  <span
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color.charAt(0).toUpperCase() + color.slice(1)}
                  />
                ))}
                {product.colors.length > 5 && (
                  <span className="text-xs text-gray-500 self-center">
                    +{product.colors.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tallas */}
          {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Único' && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Tallas:</p>
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 6).map((size: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-700 border border-gray-200"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 6 && (
                  <span className="text-xs text-gray-500 self-center">
                    +{product.sizes.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Estado de stock y envío */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className={`text-sm font-medium ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
            
            {product.price > 50 && !isOutOfStock && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                🚚 Envío gratis
              </span>
            )}
          </div>
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
          <div className="flex gap-2 mt-2">
            <button className="flex-1 text-xs text-gray-600 hover:text-blue-600 transition-colors">
              ❤️ Favorito
            </button>
            <button className="flex-1 text-xs text-gray-600 hover:text-blue-600 transition-colors">
              🔄 Comparar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}