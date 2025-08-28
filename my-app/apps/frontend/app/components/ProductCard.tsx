'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react'; // Añadido useEffect
import { Product } from '../types/product';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
}

export default function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // DEBUG EXTREMO - Agregado
  useEffect(() => {
    const imgUrl = product.mainImageUrl || product.mainImage;
    console.log('🔍 IMAGE DEBUG:', {
      url: imgUrl,
      exists: !!imgUrl,
      isExternal: imgUrl?.includes('http'),
      isLocalhost: imgUrl?.includes('localhost')
    });

    // Test real de la imagen
    if (imgUrl) {
      fetch(imgUrl)
        .then(response => {
          console.log('🌐 Image fetch status:', response.status);
          return response.blob();
        })
        .then(blob => {
          console.log('✅ Image loaded successfully, size:', blob.size);
        })
        .catch(error => {
          console.log('❌ Image fetch failed:', error);
        });
    }
  }, [product]);

  const getColorHex = (color: string): string => {
    const colorMap: Record<string, string> = {
      'negro': '#000000', 'blanco': '#ffffff', 'rojo': '#ff0000',
      'azul': '#0000ff', 'verde': '#00ff00', 'gris': '#808080',
      'amarillo': '#ffff00', 'rosa': '#ffc0cb', 'morado': '#800080',
      'naranja': '#ffa500', 'marron': '#a52a2a', 'beige': '#f5f5dc',
      'azul marino': '#000080', 'verde oscuro': '#006400', 'cyan': '#00ffff',
      'magenta': '#ff00ff', 'plateado': '#c0c0c0', 'dorado': '#ffd700',
      'turquesa': '#40e0d0', 'lavanda': '#e6e6fa', 'coral': '#ff7f50',
      'ocre': '#cc7722', 'vino': '#722f37'
    };
    
    return colorMap[color.toLowerCase()] || '#f0f0f0';
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const isNew = showNewBadge && product.createdAt 
    ? (new Date().getTime() - new Date(product.createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000)
    : false;

  const isOutOfStock = (product.stockQuantity === 0 || !product.inStock);

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
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
        className="block relative"
        aria-label={`Ver detalles de ${product.name}`}
      >
        {/* Imagen del producto - CORREGIDO */}
      <Image
  src={imageError ? '/images/placeholder.jpg' : (product.mainImageUrl || product.mainImage || '/images/placeholder.jpg')}
  alt={product.name}
  fill
  className="object-cover group-hover:scale-105 transition-transform duration-300"
  unoptimized={true} // ← Mantén esto
  onError={() => setImageError(true)}
/>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3rem]">
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

          <div className="mb-3">
            {hasDiscount ? (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">
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

          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Colores disponibles:</p>
              <div className="flex gap-2">
                {product.colors.slice(0, 5).map((color: string, index: number) => (
                  <span
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm"
                    style={{ 
                      backgroundColor: getColorHex(color)
                    }}
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

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className={`text-sm font-medium ${
              !isOutOfStock && product.stockQuantity && product.stockQuantity > 10 ? 'text-green-600' : 
              !isOutOfStock && product.stockQuantity && product.stockQuantity > 0 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {!isOutOfStock ? (
                product.stockQuantity && product.stockQuantity > 10 ? '✅ Disponible' : 
                `⚠️ Últimas ${product.stockQuantity} unidades`
              ) : '❌ Agotado'}
            </span>
            
            {product.price > 50 && !isOutOfStock && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                🚚 Envío gratis
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
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