'use client';
import { useState } from 'react';
import { Product } from '../types/product';
import ProductRelated from './RelatedProducts';
import Breadcrumb from './ui/Breadcrumbs';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import StockBadge from './StockBadge';
import PriceDisplay from './PriceDisplay';
import ImageGallery from './ImageGallery';
import ProductSpecifications from './ProductSpecifications';
import SizeGuideModal from './SizeGuideModal';
import ProductReviews from './ProductReviews';

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

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const images = product.images || [];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const isAvailable = product.inStock;
  const stockQuantity = product.stock || product.stockQuantity || 0;

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: product.category || 'Productos', href: `/categoria/${product.category}` },
    ...(product.subcategory
      ? [{ label: product.subcategory, href: `/categoria/${product.category}/${product.subcategory}` }]
      : []),
    { label: product.name, href: '#' },
  ];

  const handleAddToCart = async () => {
    if (!product || !product.inStock || !selectedSize) return;
    
    setAddingToCart(true);
    try {
      console.log('Agregando al carrito:', {
        productId: product.id,
        name: product.name,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
        quantity: quantity
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('¡Producto agregado al carrito!');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar el producto al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla antes de comprar');
      return;
    }
    alert('Redirigiendo al proceso de compra...');
  };

  return (
    <div className="bg-white min-h-screen">
      <SizeGuideModal 
        isOpen={showSizeGuide} 
        onClose={() => setShowSizeGuide(false)} 
        category={product.category}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative">
            <ImageGallery images={images} productName={product.name} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-sm text-gray-600 mb-4">Marca: {product.brand}</p>
              )}
            </div>

            <div className="space-y-3">
              <PriceDisplay 
                price={product.price} 
                originalPrice={product.originalPrice} 
                className="text-2xl" 
              />
              
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(product.rating!)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} {product.reviewCount ? `(${product.reviewCount} reseñas)` : ''}
                  </span>
                </div>
              )}
            </div>

            {colors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Color: {selectedColor}</h3>
                </div>
                <ColorSelector
                  colors={colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                  colorMap={COLOR_MAP}
                />
              </div>
            )}

            {sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Talla</h3>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Guía de tallas
                  </button>
                </div>
                <SizeSelector 
                  sizes={sizes} 
                  selectedSize={selectedSize} 
                  onSelectSize={setSelectedSize} 
                />
              </div>
            )}

            <div className="space-y-3">
              <StockBadge isAvailable={isAvailable} stockQuantity={stockQuantity} />
              
              {isAvailable && (
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-gray-900">Cantidad:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    {[...Array(Math.min(stockQuantity, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || addingToCart || !selectedSize}
                className="flex-1 bg-black text-white px-8 py-4 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Agregando...
                  </>
                ) : (
                  'Agregar al carrito'
                )}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!isAvailable || !selectedSize}
                className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Comprar ahora
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm">Envío gratis en compras superiores a $50.000</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm">Devoluciones gratis dentro de los 30 días</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'description' && 'Descripción'}
                {tab === 'specifications' && 'Especificaciones'}
                {tab === 'reviews' && `Reseñas (${product.reviewCount || 0})`}
              </button>
            ))}
          </nav>
        </div>

        <div className="mb-16">
          {activeTab === 'description' && product.description && (
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && product.specifications && (
            <ProductSpecifications specifications={product.specifications} />
          )}

          {activeTab === 'reviews' && (
            <ProductReviews 
              productId={product.id} 
              productName={product.name}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          )}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos relacionados</h2>
          <ProductRelated currentProductId={product.id} category={product.category} />
        </div>
      </div>
    </div>
  );
}