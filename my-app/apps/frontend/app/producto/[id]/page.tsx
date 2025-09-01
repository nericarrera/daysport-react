'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ProductService } from '@/services/productService';
import { Product } from '../../types/product';
import ProductDetail from '../../components/ProductDetailPage';

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  // ✅ Múltiples formas de obtener el ID
  const productId = params.id as string || 
                   searchParams.get('id') || 
                   window.location.pathname.split('/').pop();

  console.log('🔍 Params:', params);
  console.log('🔍 Product ID from params:', productId);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setError('');
        
        // ✅ Verificación mejorada del ID
        if (!productId || productId === 'undefined' || productId === 'null') {
          console.error('❌ Invalid product ID:', productId);
          throw new Error('ID de producto no válido');
        }

        console.log('🔄 Loading product ID:', productId);

        // ✅ Llama DIRECTAMENTE al backend
        const response = await fetch(`http://localhost:3001/api/products/${productId}`);
        
        console.log('📊 Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Producto no encontrado');
          }
          throw new Error(`Error del servidor: ${response.status}`);
        }
        
        const productData = await response.json();
        console.log('✅ Product received:', productData.name);
        setProduct(productData);
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    }
    
    if (productId && productId !== 'undefined' && productId !== 'null') {
      loadProduct();
    } else {
      setLoading(false);
      setError('ID de producto no proporcionado');
    }
  }, [productId]);

  // ✅ Agrega logs para debugging
  console.log('📋 Current state:', { productId, loading, error, product });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
          <p className="text-sm text-gray-400">ID: {productId || 'N/A'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">ID solicitado: {productId || 'N/A'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h1>
          <p className="text-gray-600">El producto que buscas no existe.</p>
          <p className="text-sm text-gray-500 mt-2">ID: {productId || 'N/A'}</p>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}