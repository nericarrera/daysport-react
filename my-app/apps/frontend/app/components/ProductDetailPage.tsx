'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProductService } from '@/services/productService';
import { Product } from '../types/product';
import ProductRelated from '../components/RelatedProducts';
import Breadcrumb from '../components/ui/Breadcrumbs';
import ColorSelector from '../components/ColorSelector';
import SizeSelector from '../components/SizeSelector';
import ImageGallery from '../components/ImageGallery';
import StockBadge from '../components/StockBadge';
import PriceDisplay from '../components/PriceDisplay';
import ProductSpecifications from '../components/ProductSpecifications';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

// Mapa de colores para el selector
const COLOR_MAP: Record<string, string> = {
  negro: '#000000',
  blanco: '#ffffff',
  rojo: '#ff0000',
  azul: '#0000ff',
  verde: '#00ff00',
  gris: '#808080',
  amarillo: '#ffff00',
  rosa: '#ffc0cb',
  morado: '#800080',
  naranja: '#ffa500',
  marron: '#a52a2a',
  beige: '#f5f5dc',
  celeste: '#87ceeb',
  violeta: '#ee82ee',
  turquesa: '#40e0d0',
  lila: '#c8a2c8',
  ocre: '#cc7722',
  borravino: '#800020',
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  // Función para cargar el producto
  const loadProduct = useCallback(async () => {
    try {
      setError('');
      if (!productId) throw new Error('ID de producto no proporcionado');

      console.log('🔄 Loading product ID:', productId);

      const productData = await ProductService.getProductById(productId);
      if (!productData) throw new Error('Producto no encontrado');

      setProduct(productData);
      
      // Seleccionar primer color y talla por defecto si existen
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
    } catch (error) {
      console.error('💥 Error loading product:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  // Función para manejar agregar al carrito
  const handleAddToCart = async () => {
    if (!product || !product.inStock) return;
    
    setAddingToCart(true);
    try {
      // Aquí iría la lógica para agregar al carrito
      console.log('Agregando al carrito:', {
        productId: product.id,
        name: product.name,
        size: selectedSize,
        color: selectedColor,
        price: product.price
      });
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar feedback al usuario
      // Podrías usar un toast notification aquí
      alert('¡Producto agregado al carrito!');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar el producto al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  // Función para manejar favoritos
  const handleAddToFavorites = () => {
    // Lógica para agregar a favoritos
    console.log('Agregando a favoritos:', product?.id);
    // Podrías implementar un estado local para favoritos
  };

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

  const images = product.images || [];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const isAvailable = product.inStock;
  const stockQuantity = product.stock || product.stockQuantity || 0;

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: product.category || 'Productos', href: `/categoria/${product.category}` },
    ...(product.subcategory ? [{ 
      label: product.subcategory, 
      href: `/categoria/${product.category}/${product.subcategory}` 
    }] : []),
    { label: product.name, href: `#` }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items ={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Galería de imágenes */}
        <ImageGallery 
          images={images}
          productName={product.name}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
        />

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            {product.brand && (
              <p className="text-sm text-gray-500 mb-3">
                Marca: <span className="font-medium">{product.brand}</span>
              </p>
            )}
            
            <PriceDisplay 
              price={product.price}
              originalPrice={product.originalPrice}
              className="mb-4"
            />

            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} {product.reviewCount ? `(${product.reviewCount} reseñas)` : ''}
                </span>
              </div>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Selector de color */}
          {colors.length > 0 && (
            <ColorSelector
              colors={colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              colorMap={COLOR_MAP}
            />
          )}

          {/* Selector de talla */}
          {sizes.length > 0 && (
            <SizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />
          )}

          {/* Stock y botones de acción */}
          <div className="space-y-4 pt-2">
            <StockBadge 
              isAvailable={isAvailable} 
              stockQuantity={stockQuantity} 
            />

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || addingToCart}
                className={`flex-1 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  isAvailable
                    ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {addingToCart ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Agregando...
                  </>
                ) : (
                  isAvailable ? 'Agregar al carrito' : 'Sin stock'
                )}
              </button>

              <button
                onClick={handleAddToFavorites}
                aria-label="Agregar a favoritos"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                ❤️
              </button>
            </div>
          </div>

          {/* Envío y devoluciones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>🚚</span>
              <span>Envío gratis en compras superiores a $50</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <span>↩️</span>
              <span>Devoluciones gratis dentro de los 30 días</span>
            </div>
          </div>

          {/* Especificaciones */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <ProductSpecifications specifications={product.specifications} />
          )}
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
        <ProductRelated
          currentProductId={product.id}
          category={product.category}
        />
      </div>
    </div>
  );
}