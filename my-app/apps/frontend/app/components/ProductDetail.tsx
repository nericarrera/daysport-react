'use client';
import { useState } from 'react';
import { Product } from '../types/product';
import ProductRelated from './RelatedProducts';
import Breadcrumb from './ui/Breadcrumbs';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import ImageGallery from './ImageGallery';
import StockBadge from './StockBadge';
import PriceDisplay from './PriceDisplay';
import ProductSpecifications from './ProductSpecifications';

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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [addingToCart, setAddingToCart] = useState(false);

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
    if (!product || !product.inStock) return;
    setAddingToCart(true);
    try {
      console.log('Agregando al carrito:', {
        productId: product.id,
        name: product.name,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('¡Producto agregado al carrito!');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ImageGallery
          images={images}
          productName={product.name}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
        />

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <PriceDisplay price={product.price} originalPrice={product.originalPrice} className="mb-4" />

          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {colors.length > 0 && (
            <ColorSelector
              colors={colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              colorMap={COLOR_MAP}
            />
          )}

          {sizes.length > 0 && (
            <SizeSelector sizes={sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
          )}

          <StockBadge isAvailable={isAvailable} stockQuantity={stockQuantity} />

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || addingToCart}
            className="px-8 py-3 rounded-lg bg-blue-600 text-white"
          >
            {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
          </button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
        <ProductRelated currentProductId={product.id} category={product.category} />
      </div>
    </div>
  );
}