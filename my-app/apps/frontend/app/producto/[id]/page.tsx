'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductService } from '@/services/productService';
import { Product } from '../../types/product';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import ProductDetail from '../../components/ProductDetail'; // ✅ importa el correcto

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadProduct = useCallback(async () => {
    try {
      setError('');
      if (!productId) {
        throw new Error('ID de producto no proporcionado');
      }

      const productData = await ProductService.getProductById(productId);
      if (!productData) {
        throw new Error('Producto no encontrado');
      }

      setProduct(productData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      loadProduct();
    } else {
      setLoading(false);
      setError('ID de producto no proporcionado');
    }
  }, [productId, loadProduct]);

  if (loading) {
    return <LoadingSpinner productId={productId} />;
  }

  if (error || !product) {
    return (
      <ErrorDisplay 
        error={error} 
        productId={productId}
        onRetry={loadProduct}
      />
    );
  }

  // ✅ renderiza ProductDetail (el componente de presentación)
  return <ProductDetail product={product} />;
}