'use client';
import { useState, useEffect, useRef } from 'react';

const videos = [
  { src: '/videos-portada/daysport0.mp4', title: 'Colección Daysport' },
  { src: '/videos-portada/daysport1.mp4', title: 'Nueva Colección' },
  { src: '/videos-portada/mujer-corriendo-playa0.mp4', title: 'Línea Mujer' },
  { src: '/videos-portada/natacion0.mp4', title: 'Línea Natación' },
  { src: '/videos-portada/niños0.mp4', title: 'Línea Niños' }
];

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true); // Nuevo estado para visibilidad
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Observer para detectar visibilidad
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    const container = document.querySelector('#video-carousel-container');
    if (container) observer.observe(container);

    return () => {
      if (container) observer.unobserve(container);
    };
  }, []);

  // Inicializar referencias
  useEffect(() => {
    videoRefs.current = videos.map(() => null);
  }, []);

  // Manejar reproducción basada en visibilidad
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) return;

    const handlePlayback = async () => {
      try {
        if (isVisible) {
          setIsLoading(true);
          // Primero pausar todos los videos
          videoRefs.current.forEach(video => {
            if (video && video !== currentVideo) video.pause();
          });
          
          // Cargar y reproducir el video actual
          await currentVideo.load();
          await currentVideo.play();
          setIsLoading(false);
          setError(null);
        } else {
          currentVideo.pause();
        }
      } catch (err) {
        console.error("Error en reproducción:", err);
        setError("Error al reproducir el video");
        setIsLoading(false);
        
        // Intentar nuevamente con mute forzado
        try {
          if (currentVideo) {
            currentVideo.muted = true;
            await currentVideo.play();
          }
        } catch (fallbackErr) {
          console.error("Error en reproducción con mute:", fallbackErr);
        }
      }
    };

    handlePlayback();

    return () => {
      if (currentVideo) {
        currentVideo.pause();
      }
    };
  }, [currentIndex, isVisible]);

  // Cambio automático de video (solo si está visible)
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div id="video-carousel-container" className="relative w-full h-[500px] overflow-hidden bg-black">
      {/* Estados de carga/error */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white text-lg">Cargando video...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white text-lg">{error}</div>
        </div>
      )}

      {/* Videos */}
      <div className="relative w-full h-full">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              autoPlay
              muted // Siempre muteado por políticas de autoplay
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              preload="auto"
              onError={() => setError(`Error al cargar ${video.title}`)}
              disablePictureInPicture // Mejora de performance
            >
              <source src={video.src} type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
            
            {/* Overlay con texto */}
            <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center z-20">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{video.title}</h1>
                <p className="text-xl">Descubre ofertas y productos exclusivos</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles del carrusel */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-30">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-yellow-400' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Ir al video ${index + 1}`}
          />
        ))}
      </div>

      {/* Flechas de navegación */}
      <button
        onClick={() => goToSlide((currentIndex - 1 + videos.length) % videos.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-30"
        aria-label="Video anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((currentIndex + 1) % videos.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-30"
        aria-label="Siguiente video"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}