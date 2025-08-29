'use client';
import { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { getProductsByCategory } from '../data/mockProducts';
import ProductGrid from '../components/ProductGrid';


// Importaciones para filtros y ordenamiento
const PRICE_RANGES = [
  { label: 'Todos los precios', value: 'all' },
  { label: 'Hasta $50', value: '0-50' },
  { label: '$50 - $100', value: '50-100' },
  { label: '$100 - $150', value: '100-150' },
  { label: 'Más de $150', value: '150+' }
];

const SORT_OPTIONS = [
  { label: 'Recomendados', value: 'featured' },
  { label: 'Precio: Menor a Mayor', value: 'price-asc' },
  { label: 'Precio: Mayor a Menor', value: 'price-desc' },
  { label: 'Más Nuevos', value: 'newest' },
  { label: 'Mejor Valorados', value: 'rating' }
];

// Subcategorías para mujer
const SUBCATEGORIES = [
  { id: 'remeras', name: 'Remeras Deportivas', image: '/images/mujer/remeras.jpg' },
  { id: 'shorts', name: 'Shorts Deportivos', image: '/images/mujer/shorts.jpg' },
  { id: 'calzas', name: 'Calzas Deportivas', image: '/images/mujer/calzas.jpg' },
  { id: 'buzos', name: 'Buzos Deportivos', image: '/images/mujer/buzos.jpg' },
  { id: 'camperas', name: 'Camperas Deportivas', image: '/images/mujer/camperas.jpg' }
];

export default function MujerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [loading, setLoading] = useState(true);

  // Cargar productos
  useEffect(() => {
    const loadProducts = () => {
      try {
        console.log('🔄 Cargando productos de mujer...');
        const mujerProducts = getProductsByCategory('mujer');
        console.log('✅ Productos cargados:', mujerProducts.length);
        setProducts(mujerProducts);
        setFilteredProducts(mujerProducts);
      } catch (error) {
        console.error('❌ Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Filtrar por subcategoría
    if (selectedSubcategory) {
      result = result.filter(product => product.subcategory === selectedSubcategory);
    }

    // Filtrar por precio
    if (priceRange !== 'all') {
      result = result.filter(product => {
        switch (priceRange) {
          case '0-50': return product.price <= 50;
          case '50-100': return product.price > 50 && product.price <= 100;
          case '100-150': return product.price > 100 && product.price <= 150;
          case '150+': return product.price > 150;
          default: return true;
        }
      });
    }

    // Ordenar
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // featured: productos destacados primero
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [products, selectedSubcategory, priceRange, sortOption]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Ropa Deportiva para Mujer</h1>
        <p className="text-lg text-gray-600">Encuentra la mejor ropa deportiva para tu entrenamiento</p>
      </div>

      {/* Subcategorías */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SUBCATEGORIES.map((subcat) => (
            <button
              key={subcat.id}
              onClick={() => setSelectedSubcategory(selectedSubcategory === subcat.id ? '' : subcat.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedSubcategory === subcat.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-2xl">🏃‍♀️</span>
                </div>
                <span className="text-sm font-medium">{subcat.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filtros y Ordenamiento */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por precio</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {PRICE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </label>
            <button
              onClick={() => {
                setSelectedSubcategory('');
                setPriceRange('all');
                setSortOption('featured');
              }}
              className="w-full p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div>
        {selectedSubcategory && (
          <h2 className="text-2xl font-semibold mb-6 capitalize">
            {SUBCATEGORIES.find(sc => sc.id === selectedSubcategory)?.name}
          </h2>
        )}
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta con otros filtros o categorías</p>
            <button
              onClick={() => {
                setSelectedSubcategory('');
                setPriceRange('all');
                setSortOption('featured');
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  );
}