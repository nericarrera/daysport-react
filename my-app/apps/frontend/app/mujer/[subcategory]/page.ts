'use client';
import { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { getProductsByCategory } from '../../data/mockProducts';
import ProductGrid from '../../components/ProductGrid';

// Mapeo de nombres bonitos para subcategorías
const subcategoryNames: { [key: string]: string } = {
  remeras: 'Remeras Deportivas',
  shorts: 'Shorts Deportivos', 
  calzas: 'Calzas Deportivas',
  buzos: 'Buzos Deportivos',
  camperas: 'Camperas Deportivas'
};

// Mapeo de emojis para subcategorías
const subcategoryEmojis: { [key: string]: string } = {
  remeras: '👕',
  shorts: '🩳',
  calzas: '🧘‍♀️',
  buzos: '🧥',
  camperas: '🧥'
};

export default function SubcategoryPage({ params }: { params: { subcategory: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = () => {
      try {
        console.log(`🔄 Cargando productos de mujer/${params.subcategory}...`);
        const allProducts = getProductsByCategory('mujer');
        const filteredProducts = allProducts.filter(product => 
          product.subcategory === params.subcategory
        );
        console.log(`✅ Productos filtrados:`, filteredProducts.length);
        setProducts(filteredProducts);
      } catch (error) {
        console.error('❌ Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [params.subcategory]);

  const displayName = subcategoryNames[params.subcategory] || params.subcategory;
  const emoji = subcategoryEmojis[params.subcategory] || '🏃‍♀️';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{emoji}</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {displayName} para Mujer
        </h1>
        <p className="text-lg text-gray-600">
          {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Productos */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😢</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay productos en esta categoría
          </h3>
          <p className="text-gray-500">
            Pronto agregaremos más productos de {displayName.toLowerCase()}
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}