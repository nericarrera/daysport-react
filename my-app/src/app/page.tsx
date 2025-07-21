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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto px-4 my-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src={`/img/banner/promo-${item}.jpg`}
              alt={`Promoción ${item}`}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </>
  );
}