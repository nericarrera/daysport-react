// components/ProductGrid.tsx - VERSIÓN CORREGIDA
import ProductCard from './ProductCard';

// Tipo que acepta ambas versiones (image O images)
interface CompatibleProduct {
  id: number;
  name: string;
  price: number;
  image?: string;       // ← Hacer opcional para nueva versión
  images?: string[];    // ← Hacer opcional para vieja versión  
  category: string;
  subcategory?: string;
}

interface ProductGridProps {
  products: CompatibleProduct[];
  category?: string;
}

export default function ProductGrid({ products, category }: ProductGridProps) {
  // Función para normalizar los productos
  const normalizeProduct = (product: CompatibleProduct) => {
    // Si tiene images, usar la primera imagen
    if (product.images && product.images.length > 0) {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory || ''
      };
    }
    
    // Si tiene image, convertir a array
    if (product.image) {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        images: [product.image],
        category: product.category,
        subcategory: product.subcategory || ''
      };
    }
    
    // Si no tiene ninguna, usar placeholder
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      images: ['/images/placeholder.jpg'],
      category: product.category,
      subcategory: product.subcategory || ''
    };
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          No se encontraron productos en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const normalizedProduct = normalizeProduct(product);
        return <ProductCard key={product.id} product={normalizedProduct} />;
      })}
    </div>
  );
}