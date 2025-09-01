'use client';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  mainImageUrl?: string;
  images?: string[];
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
}

export default function ProductDetail({ product }: { product: Product }) {
  const mainImage = product.mainImageUrl || product.images?.[0] || '/placeholder.jpg';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imágenes */}
        <div>
          <div className="relative h-96 mb-4">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(0, 3).map((img, idx) => (
                <div key={idx} className="relative h-24">
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {product.brand && (
            <p className="text-gray-600 mb-2">Marca: {product.brand}</p>
          )}
          
          {product.category && (
            <p className="text-gray-600 mb-4">Categoría: {product.category}</p>
          )}

          {/* Precio */}
          <div className="mb-4">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  ${product.price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
                <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                  {Math.round((1 - product.price / product.originalPrice!) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Stock */}
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              product.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.inStock ? 'En stock' : 'Sin stock'}
            </span>
          </div>

          {/* Descripción */}
          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          {/* Tallas */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Tallas disponibles:</h3>
              <div className="flex gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colores */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Colores:</h3>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <span
                    key={color}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botón de compra */}
          <button 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!product.inStock}
          >
            {product.inStock ? 'Agregar al carrito' : 'Sin stock'}
          </button>

          {/* Especificaciones */}
          {product.specifications && (
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Especificaciones:</h3>
              <div className="grid gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}