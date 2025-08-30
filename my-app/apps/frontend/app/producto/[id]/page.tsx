'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ProductService } from '../../../services/productService';
import { Product } from '../../types/product';
import ProductRelated from '../../components/RelatedProducts'; // ← NUEVA IMPORTACIÓN

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        const productId = params.id as string;
        const productData = await ProductService.getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Producto no encontrado</p>
        </div>
      </div>
    );
  }

  const getColorHex = (color: string): string => {
    const colorMap: Record<string, string> = {
      'negro': '#000000', 'blanco': '#ffffff', 'rojo': '#ff0000',
      'azul': '#0000ff', 'verde': '#00ff00', 'gris': '#808080',
      'amarillo': '#ffff00', 'rosa': '#ffc0cb', 'morado': '#800080',
      'naranja': '#ffa500', 'marron': '#a52a2a', 'beige': '#f5f5dc'
    };
    return colorMap[color.toLowerCase()] || '#f0f0f0';
  };

  const images = product.images || [];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const inStock = product.inStock || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ... (TODO TU CÓDIGO EXISTENTE) ... */}
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-green-600 font-bold mb-4">${product.price}</p>
          {/* ... resto de tu código ... */}
        </div>
      </div>

      {/* PRODUCTOS RELACIONADOS - SOLO ESTO ES NUEVO */}
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