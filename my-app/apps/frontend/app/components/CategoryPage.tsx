'use client';

import { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import Filters from './Filters';
import { Product } from '../../services/types'; // ← Importa el tipo correcto

interface CategoryPageProps {
  title: string;
  description: string;
  category: string;
}

export default function CategoryPage({ 
  title, 
  description, 
  category,
}: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]); // ← Usa el tipo Product importado
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `http://localhost:3001/products?category=${category}`;
        
        if (selectedSubcategory) {
          url += `&subcategory=${selectedSubcategory}`;
        }

        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, selectedSubcategory]);

  const handleFilterChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros (sidebar en desktop) */}
        <div className="md:w-1/4">
          <Filters 
            category={category}
            onFilterChange={handleFilterChange}
            selectedSubcategory={selectedSubcategory}
          />
        </div>

        {/* Productos */}
        <div className="md:w-3/4">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}