import ProductCarousel from './components/ProductCarousel';
import { getFeaturedProducts } from './data/Products';
import VideoCarousel from './components/VideoCarousel';
import CategorySelector from './components/CategorySelector'; // Importa el nuevo componente

export default async function Home() {
  const womenProducts = await getFeaturedProducts('mujer');
  const menProducts = await getFeaturedProducts('hombre');
  const kidsProducts = await getFeaturedProducts('niños');
  const accessoriesProducts = await getFeaturedProducts('accesorios');

  return (
    <div className="bg-white">
      {/* VideoCarousel como hero banner - contenedor principal */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <VideoCarousel />
      </div>

      {/* Slogan */}
      <div className="py-8 text-center bg-black text-yellow-400">
        <p className="text-4xl font-light">MAKE A DIFFERENCE</p>
      </div>

      {/* Nuevo selector de categorías */}
      <CategorySelector />

      {/* Carruseles de productos */}
      <div className="bg-transparent mx-auto px-4">
        <ProductCarousel title="Novedades Mujer" products={womenProducts} />
        <ProductCarousel title="Novedades Hombre" products={menProducts} />
        <ProductCarousel title="Novedades Niños" products={kidsProducts} />
        <ProductCarousel title="Novedades Accesorios" products={accessoriesProducts} />
      </div>
    </div>
  );
}