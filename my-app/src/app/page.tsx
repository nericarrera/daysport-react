import ProductCarousel from './components/ProductCarousel';
import { getFeaturedProducts } from './components/Product';

export default async function Home() {
  // En un proyecto real, estos datos podrían venir de una API o CMS
  const womenProducts = await getFeaturedProducts('mujer');
  const menProducts = await getFeaturedProducts('hombre');
  const kidsProducts = await getFeaturedProducts('niños');

  return (
    <>
      {/* Banner Hero */}
      <div className="relative h-[500px] overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/daysport0.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tu mejor compra está aquí</h1>
            <p className="text-xl">Descubre ofertas y productos exclusivos</p>
          </div>
        </div>
      </div>

      {/* Slogan */}
      <div className="py-8 text-center bg-black text-yellow-400">
        <p className="text-4xl font-light ">MAKE A DIFFERENCE</p>
      </div>

      {/* Carruseles de productos */}
      <div className="max-w-7xl mx-auto px-4">
        <ProductCarousel title="Novedades Mujer" products={womenProducts} />
        <ProductCarousel title="Novedades Hombre" products={menProducts} />
        <ProductCarousel title="Novedades Niños" products={kidsProducts} />
        <ProductCarousel title="Novedades Accesorios" products={[]} />
      </div>

      {/* Banner promocional */}
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