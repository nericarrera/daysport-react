'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CategorySelector() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const categories = [
    { id: 'mujer', name: 'Mujer', image: '/menu-categoria-img/categoria-mujer1.jpg' },
    { id: 'hombre', name: 'Hombre', image: '/menu-categoria-img/categoria-hombre1.jpg' },
    { id: 'ninos', name: 'Niños', image: '/menu-categoria-img/categoria-niños1.jpg' },
    { id: 'zapatillas', name: 'Zapatillas', image: '/menu-categoria-img/categoria-zapatillas3.jpg' },
    { id: 'accesorios', name: 'Accesorios', image: '/menu-categoria-img/categoria-accesorios1.jpg' },
    { id: 'deportes', name: 'Deportes', image: '/menu-categoria-img/categoria-deportes.jpg' },
    { id: 'ofertas', name: 'Ofertas', image: '/menu-categoria-img/categoria-ofertas1.jpg' },
    { id: 'colecciones', name: 'Colecciones', image: '/menu-categoria-img/categoria-coleccion.jpg' }
  ];

  // Verificar visibilidad de flechas
  const checkArrows = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Scroll suave
  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'right' ? 300 : -300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Efecto para verificar flechas al cargar y redimensionar
  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, []);

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">Explora Nuestras Categorías</h2>
        
        {/* Contenedor principal */}
        <div className="relative">
          {/* Flecha izquierda */}
          <button 
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all ${!showLeftArrow && 'hidden'}`}
            aria-label="Categorías anteriores"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Contenedor de categorías - Scroll oculto */}
          <div 
            ref={containerRef}
            onScroll={checkArrows}
            className="overflow-x-hidden whitespace-nowrap py-4 scroll-smooth"
          >
            <div className="inline-flex space-x-8 px-4">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="inline-flex flex-col items-center cursor-pointer group"
                  onClick={() => router.push(`/categoria/${category.id}`)}
                >
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-all mb-4 object-cover">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={120}
                      height={120}
                      className="object-contain w-auto h-auto object-center group-hover:scale-105 transition-transform "
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 group-hover:text-yellow-400 transition-colors whitespace-normal text-center">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Flecha derecha */}
          <button 
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all ${!showRightArrow && 'hidden'}`}
            aria-label="Siguientes categorías"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}