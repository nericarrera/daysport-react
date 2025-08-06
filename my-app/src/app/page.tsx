import ProductCarousel from './components/ProductCarousel';
import { getFeaturedProducts } from './data/Products'; // Usando alias @
import VideoCarousel from './components/VideoCarousel';
import CategorySelector from './components/CategorySelector';

export default async function Home() {
  const [womenProducts, menProducts, kidsProducts, accessoriesProducts] = await Promise.all([
    getFeaturedProducts('mujer'),
    getFeaturedProducts('hombre'),
    getFeaturedProducts('niños'),
    getFeaturedProducts('accesorios')
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
        <ProductCarousel title="Novedades Mujer" products={womenProducts} />
        <ProductCarousel title="Novedades Hombre" products={menProducts} />
        <ProductCarousel title="Novedades Niños" products={kidsProducts} />
        <ProductCarousel title="Novedades Accesorios" products={accessoriesProducts} />
      </div>
    </div>
  );
}