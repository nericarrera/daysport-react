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

        // DEBUG: Verificar si el servicio funciona
        console.log('🔍 Calling ProductService.getProductById...');
        const productData = await ProductService.getProductById(productId);
        
        console.log('✅ Product data received:', productData);
        
        if (!productData) {
          throw new Error('Producto no encontrado en la respuesta');
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

  // DEBUG: Mostrar información útil
  useEffect(() => {
    console.log('📊 Current state:', {
      params: params,
      productId: params?.id,
      loading,
      error,
      product
    });
  }, [params, loading, error, product]);

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
          
          <div className="bg-gray-100 p-4 rounded-lg text-left max-w-md mx-auto mb-6">
            <h3 className="font-semibold mb-2">¿Qué puede estar pasando?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• El producto no existe en la base de datos</li>
              <li>• El backend no está ejecutándose</li>
              <li>• Error en la conexión con la API</li>
            </ul>
          </div>

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

  // ... (el resto de tu código para cuando SÍ hay producto) ...
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
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-green-600 mb-4">${product.price}</p>
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
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