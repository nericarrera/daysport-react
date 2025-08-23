// apps/frontend/app/page.tsx
import ProductCarousel from './components/ProductCarousel';
import VideoCarousel from './components/VideoCarousel';
import CategorySelector from './components/CategorySelector';
import { ProductService } from '../services/productService';
import { Product } from '../services/types'; // ← Corregí la ruta de Types a types

export default async function Home() {
  try {
    // Obtener productos destacados usando el servicio
    const [womenProducts, menProducts, kidsProducts, accessoriesProducts] = await Promise.all([
      ProductService.getProductsByCategory('mujer').then((products: Product[]) => 
        products.filter(p => p.featured).slice(0, 8)
      ),
      ProductService.getProductsByCategory('hombre').then((products: Product[]) => 
        products.filter(p => p.featured).slice(0, 8)
      ),
      ProductService.getProductsByCategory('ninos').then((products: Product[]) => 
        products.filter(p => p.featured).slice(0, 8)
      ),
      ProductService.getProductsByCategory('accesorios').then((products: Product[]) => 
        products.filter(p => p.featured).slice(0, 8)
      ),
    ]);

    return (
      <div className="bg-white">
        <div className="relative w-full h-[500px] overflow-hidden">
          <VideoCarousel />
        </div>

        <div className="py-8 text-center bg-black text-yellow-400">
          <p className="text-4xl font-light">MAKE A DIFFERENCE</p>
        </div>

        <CategorySelector />

        <div className="bg-transparent mx-auto px-4">
          <ProductCarousel 
            title="Novedades Mujer" 
            products={womenProducts} 
          />
          <ProductCarousel 
            title="Novedades Hombre" 
            products={menProducts} 
          />
          <ProductCarousel 
            title="Novedades Niños" 
            products={kidsProducts} 
          />
          <ProductCarousel 
            title="Novedades Accesorios" 
            products={accessoriesProducts} 
          />
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('Error loading home page:', error);
    
    // Fallback vacío si hay error
    return (
      <div className="bg-white">
        <div className="relative w-full h-[500px] overflow-hidden">
          <VideoCarousel />
        </div>

        <div className="py-8 text-center bg-black text-yellow-400">
          <p className="text-4xl font-light">MAKE A DIFFERENCE</p>
        </div>

        <CategorySelector />

        <div className="bg-transparent mx-auto px-4">
          <p className="text-center text-gray-500 py-12">
            Error cargando productos. Por favor, intenta más tarde.
          </p>
        </div>
      </div>
    );
  }
}