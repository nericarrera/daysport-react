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
  const [colorImageErrors, setColorImageErrors] = useState<Record<string, boolean>>({});
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Imagen secundaria (ej: parte trasera de la prenda)
  const hoverImage = useMemo(() => {
    if (product.images && product.images.length > 1) {
      return product.images[1]; // la segunda imagen del array
    }
    return null;
  }, [product.images]);

  const { hasDiscount, discountPercentage, isNew, isOutOfStock } = useMemo(() => {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount 
      ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
      : 0;

    const isNew = showNewBadge && product.createdAt 
      ? (Date.now() - new Date(product.createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000)
      : false;

    const stock = product.stockQuantity !== undefined ? product.stockQuantity : product.stock;
    const isOutOfStock = stock === 0 || !product.inStock;

    return { hasDiscount, discountPercentage, isNew, isOutOfStock };
  }, [product, showNewBadge]);

  // ✅ Imagen principal dinámica
  const imageSrc = useMemo(() => {
    if (hoveredImage) return hoveredImage; // si pasó por miniatura
    if (isHovered && hoverImage) return hoverImage; // si está sobre la tarjeta
    return imageError 
      ? '/images/placeholder.jpg' 
      : (product.mainImageUrl || product.mainImage || '/images/placeholder.jpg');
  }, [hoveredImage, isHovered, hoverImage, imageError, product.mainImageUrl, product.mainImage]);

  // ✅ Manejo de favoritos
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

  const handleColorImageError = useCallback((color: string) => {
    setColorImageErrors(prev => ({ ...prev, [color]: true }));
  }, []);

  const getColorImage = useCallback((color: string) => {
    if (product.colorImages && product.colorImages[color] && product.colorImages[color].length > 0) {
      return product.colorImages[color][0];
    }
    return null;
  }, [product.colorImages]);

  return (
    <div 
      className="group relative bg-yellow shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-violet-200 flex flex-col h-full w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredImage(null);
      }}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-20 flex flex-col space-y-1">
        {isNew && <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">🆕 NUEVO</span>}
        {hasDiscount && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">🔥 -{discountPercentage}%</span>}
        {product.featured && !hasDiscount && !isNew && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">⭐ DESTACADO</span>
        )}
        {isOutOfStock && <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">🔒 AGOTADO</span>}
      </div>

      {/* Botón de favoritos */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 z-20 p-2 bg-white rounded-full shadow-md hover:bg-pink-50"
      >
        {isFavorite ? (
          <HeartSolid className="h-5 w-5 text-pink-600" />
        ) : (
          <HeartOutline className="h-5 w-5 text-gray-400 hover:text-pink-400" />
        )}
      </button>

      <Link href={`/producto/${product.slug || product.id}`} className="block relative flex-grow">
        {/* Imagen principal */}
        <div className="relative h-90 w-full overflow-hidden">
          {imageLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse z-0"></div>}
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 z-10"
            unoptimized={true}
            priority={priority}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoading(false)}
          />
        </div>

        {/* Contenido */}
        <div className="p-2 flex-grow">

           {/* Miniaturas de colores */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <div className="flex">
                {product.colors.slice(0, 4).map((color, index) => {
                  const colorImage = getColorImage(color);
                  const hasError = colorImageErrors[color];
                  return (
                    <div
                      key={index}
                      className="relative w-15 h-15 border-gray-200 overflow-hidden cursor-pointer"
                      onMouseEnter={() => setHoveredImage(colorImage || null)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      {colorImage && !hasError ? (
                        <Image
                          src={colorImage}
                          alt={`${product.name} - ${color}`}
                          fill
                          className="object-cover"
                          onError={() => handleColorImageError(color)}
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: COLOR_MAP[color.toLowerCase()] || '#f0f0f0' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Precio */}
          <div className="mb-3">
            {hasDiscount ? (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                <span className="text-lg text-red-500 line-through">${product.originalPrice!.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          {product.brand && <p className="text-sm text-gray-900 mb-1 font-medium">{product.brand}</p>}

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="capitalize">{product.category}</span>
            {product.subcategory && <><span className="mx-1">•</span><span className="capitalize">{product.subcategory}</span></>}
          </div>

          {/* Envío gratis */}
          {product.price > 10 && !isOutOfStock && (
            <div className="mt-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-flex items-center">
                🚚 Envío 
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Botón agregar al carrito */}
      <div className="px-4 pb-4 mt-auto">
        <AddToCartButton 
          product={product} 
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-lg font-semibold ${
            isOutOfStock ? 'bg-gray-400 text-gray-200' : 'bg-gray-900 text-white hover:bg-violet-500'
          }`}
        />
      </div>
    </div>
  );
}