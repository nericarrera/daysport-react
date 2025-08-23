'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../services/types';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Función para obtener el color hexadecimal
  const getColorHex = (color: string): string => {
    const colorMap: Record<string, string> = {
      'negro': '#000000',
      'blanco': '#ffffff',
      'rojo': '#ff0000',
      'azul': '#0000ff',
      'verde': '#00ff00',
      'gris': '#808080',
      'amarillo': '#ffff00',
      'rosa': '#ffc0cb',
      'morado': '#800080',
      'naranja': '#ffa500',
      'marron': '#a52a2a',
      'beige': '#f5f5dc'
    };
    
    return colorMap[color.toLowerCase()] || '#f0f0f0';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Link que envuelve toda la tarjeta */}
      <Link href={`/producto/${product.id}`} className="block">
        {/* Imagen del producto */}
        <div className="relative h-48 w-full">
          <Image
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badge de featured */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              DESTACADO
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Categoría y subcategoría */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="capitalize">{product.category}</span>
            {product.subcategory && (
              <>
                <span className="mx-1">•</span>
                <span className="capitalize">{product.subcategory}</span>
              </>
            )}
          </div>

          {/* Precio */}
          <p className="text-gray-600 mb-3">
            <span className="text-2xl font-bold text-green-600">
              ${product.price}
            </span>
          </p>

          {/* Colores disponibles (mini preview) */}
          {product.colors.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Colores:</p>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color: string, index: number) => (
                  <span
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ 
                      backgroundColor: getColorHex(color)
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tallas disponibles */}
          {product.sizes.length > 0 && product.sizes[0] !== 'Único' && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Tallas:</p>
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 4).map((size: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-700"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.sizes.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stock disponible */}
          <div className="flex items-center justify-between mt-2">
            <span className={`text-sm ${
              product.stock > 10 ? 'text-green-600' : 
              product.stock > 0 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </span>
            
            {/* Rating o badges adicionales */}
            <div className="flex items-center">
              <span className="text-yellow-400">★★★★☆</span>
              <span className="text-xs text-gray-500 ml-1">(4.0)</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Botón de acción rápida (fuera del link para evitar nested links) */}
      <div className="px-4 pb-4">
        <button 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Agregar al carrito:', product.id);
            // Aquí irá la lógica del carrito
          }}
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );

  <AddToCartButton product={product} />
}