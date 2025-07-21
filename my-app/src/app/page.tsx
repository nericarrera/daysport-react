import ProductCarousel from './components/ProductCarousel';
import { getFeaturedProducts } from './components/Product';
import VideoCarousel from './components/VideoCarousel';

export default async function Home() {
  const womenProducts = await getFeaturedProducts('mujer');
  const menProducts = await getFeaturedProducts('hombre');
  const kidsProducts = await getFeaturedProducts('niños');
  const accessoriesProducts = await getFeaturedProducts('accesorios');

  return (
    <>
      {/* Reemplazamos el banner hero estático por el VideoCarousel */}
      <VideoCarousel />

      {/* Slogan (se mantiene igual) */}
      <div className="py-8 text-center bg-black text-yellow-400">
        <p className="text-4xl font-light">MAKE A DIFFERENCE</p>
      </div>

      {/* Carruseles de productos (se mantienen igual) */}
      <div className="max-w-7xl mx-auto px-4">
        <ProductCarousel title="Novedades Mujer" products={womenProducts} />
        <ProductCarousel title="Novedades Hombre" products={menProducts} />
        <ProductCarousel title="Novedades Niños" products={kidsProducts} />
        <ProductCarousel title="Novedades Accesorios" products={accessoriesProducts} />
      </div>

      {/* Banner promocional (se mantiene igual) */}
      <div className="relative h-[500px] overflow-hidden bg-gray-800 flex items-center justify-center">
  <p className="text-white text-xl">Carrusel de videos - En desarrollo</p>
  <div className="absolute bottom-4 flex space-x-2">
    {[1, 2, 3, 4, 5].map((_, i) => (
      <button key={i} className="w-3 h-3 rounded-full bg-white"></button>
    ))}
  </div>
</div>
     
        
      
    </>
  );
}