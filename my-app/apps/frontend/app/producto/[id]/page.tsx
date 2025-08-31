'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ProductService } from '../../../services/productService';
import { Product } from '../../types/product';
import ProductRelated from '../../components/RelatedProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setError('');
        const productId = params?.id as string;
        
        console.log('🔄 Loading product ID:', productId);
        
        if (!productId) {
          throw new Error('ID de producto no proporcionado');
        }

        // ✅ Ahora usa el ProductService corregido
        const productData = await ProductService.getProductById(productId);
        
        console.log('✅ Product data received:', productData);
        
        if (!productData) {
          throw new Error('Producto no encontrado');
        }

        setProduct(productData);
      } catch (error) {
        console.error('💥 Error loading product:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }
    
    if (params?.id) {
      loadProduct();
    } else {
      setLoading(false);
      setError('ID de producto no encontrado en la URL');
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando producto...</p>
          <p className="text-sm text-gray-400">ID: {params?.id}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar el producto</h1>
          <p className="text-gray-600 mb-4">{error || 'Producto no encontrado'}</p>
          <p className="text-sm text-gray-500 mb-6">
            ID solicitado: {params?.id}
          </p>
          
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={() => window.history.back()}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getColorHex = (color: string): string => {
    const colorMap: Record<string, string> = {
      'negro': '#000000', 'blanco': '#ffffff', 'rojo': '#ff0000',
      'azul': '#0000ff', 'verde': '#00ff00', 'gris': '#808080',
      'amarillo': '#ffff00', 'rosa': '#ffc0cb', 'morado': '#800080',
      'naranja': '#ffa500', 'marron': '#a52a2a', 'beige': '#f5f5dc',
      'celeste': '#87ceeb', 'violeta': '#ee82ee', 'turquesa': '#40e0d0',
      'lila': '#c8a2c8', 'ocre': '#cc7722', 'borravino': '#800020'
    };
    return colorMap[color.toLowerCase()] || '#f0f0f0';
  };

  const images = product.images || [];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const inStock = product.inStock !== undefined ? product.inStock : product.stockQuantity || 0;
  const mainImage = product.mainImageUrl || product.mainImage || (images.length > 0 ? images[0] : '/placeholder-product.jpg');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <span className="hover:text-blue-600 cursor-pointer" onClick={() => window.history.back()}>
          ← Volver
        </span>
        <span className="mx-2">/</span>
        <span className="capitalize">{product.category}</span>
        {product.subcategory && (
          <>
            <span className="mx-2">/</span>
            <span className="capitalize">{product.subcategory}</span>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Sección de imágenes */}
        <div className="space-y-4">
          {/* Imagen principal */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                e.currentTarget.src = '/placeholder-product.jpg';
              }}
            />
          </div>

          {/* Galería de miniaturas */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Vista ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-sm text-gray-500 mb-3">Marca: {product.brand}</p>
            )}
            <p className="text-2xl font-bold text-green-600 mb-4">${product.price}</p>
            
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Selector de color */}
          {colors.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                      selectedColor === color 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                    <span className="text-sm capitalize">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de talla */}
          {sizes.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Talla</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md border-2 ${
                      selectedSize === size 
                        ? 'border-blue-600 bg-blue-50 text-blue-800' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock y botones de acción */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${
                inStock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="text-sm text-gray-600">
                {inStock > 0 ? `${inStock} disponibles` : 'Sin stock'}
              </span>
            </div>

            <div className="flex gap-4">
              <button
                disabled={inStock === 0}
                className={`flex-1 px-8 py-3 rounded-lg font-semibold transition-colors ${
                  inStock > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {inStock > 0 ? 'Agregar al carrito' : 'Sin stock'}
              </button>
              
              <button className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                ❤️
              </button>
            </div>
          </div>

          {/* Especificaciones */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Especificaciones</h3>
              <div className="grid gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Productos relacionados */}
      {product && (
        <div className="mt-16">
          <ProductRelated 
            currentProductId={product.id}
            category={product.category}
          />
        </div>
      )}
    </div>
  );
}