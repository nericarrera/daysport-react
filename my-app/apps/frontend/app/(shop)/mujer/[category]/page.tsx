'use client';

import { getProductsByCategory } from '../../../data/products'; // ← Solo esta importación
import ProductGrid from '../../../components/ProductGrid';

// Mapeo de nombres bonitos para subcategorías
const subcategoryNames: { [key: string]: string } = {
  remeras: 'Remeras Deportivas',
  shorts: 'Shorts Deportivos', 
  calzas: 'Calzas Deportivas',
  buzos: 'Buzos Deportivos',
  camperas: 'Camperas Deportivas'
};

export default function SubcategoryPage({ params }: { params: { subcategory: string } }) {
  const allProducts = getProductsByCategory('mujer');
  
  // Filtrar por subcategoría
  const filteredProducts = allProducts.filter(product => 
    product.subcategory === params.subcategory
  );

  const displayName = subcategoryNames[params.subcategory] || params.subcategory;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{displayName} para Mujer</h1>
      
      <ProductGrid products={filteredProducts} /> {/* ← Usar filteredProducts directamente */}
    </div>
  );
}