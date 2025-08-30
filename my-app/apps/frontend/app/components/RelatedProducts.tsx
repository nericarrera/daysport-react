'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: string;
  mainImage?: string; // Agregado por si acaso
  mainImageUrl?: string; // Agregado por si acaso
}

interface RelatedProductsProps {
  currentProductId: number;
  category: string;
}

interface ApiResponse {
  products: Product[];
  total: number;
}

export default function RelatedProducts({ 
  currentProductId, 
  category 
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    fetch(`http://localhost:3001/api/products?category=${category}&limit=5`)
      .then(res => res.json())
      .then((data: ApiResponse) => {
        // Filtrar el producto actual y limitar a 4 productos
        const filtered = data.products
          .filter(product => product.id !== currentProductId)
          .slice(0, 4);
        setRelatedProducts(filtered);
      })
      .catch(error => {
        console.error('Error fetching related products:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, currentProductId]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Productos relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Productos relacionados</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          // Determinar la mejor imagen a mostrar
          const mainImage = product.images?.[0] || 
                           product.mainImageUrl || 
                           product.mainImage || 
                           '/placeholder.jpg';
          
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
              <Link href={`/producto/${product.id}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback si la imagen falla
                      e.currentTarget.src = '/placeholder.jpg';
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-bold text-green-600 mb-2">${product.price}</p>
                  <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}