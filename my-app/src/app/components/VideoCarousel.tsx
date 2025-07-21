'use client';
import { useState, useEffect, useRef } from 'react';

const videos = [
  { src: '/videos/daysport0.mp4', title: 'Colección Daysport', alt: 'Video 1' },
  { src: '/videos/daysport1.mp4', title: 'Colección Daysport', alt: 'Video 2' },
  { src: '/videos/mujer-corriendo-playa0.mp4', title: 'Línea Mujer', alt: 'Video 3' },
  { src: '/videos/natacion0.mp4', title: 'Línea Natación', alt: 'Video 4' },
  { src: '/videos/niños0.mp4', title: 'Línea Niños', alt: 'Video 5' },
];

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Inicializar referencias
  useEffect(() => {
    videoRefs.current = videos.map((_, i) => videoRefs.current[i] ?? null);
  }, []);

  // Control de reproducción
  useEffect(() => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      if (isPlaying) {
        video.play().catch(e => console.error("Error al reproducir:", e));
      } else {
        video.pause();
      }
    }
  }, [currentIndex, isPlaying]);

  // Cambio automático de video
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isPlaying, videos.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Videos */}
      <div className="relative w-full h-full">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={video.src} type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{video.title}</h1>
                <p className="text-xl">Descubre ofertas y productos exclusivos</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-yellow-400' : 'bg-white bg-opacity-50'}`}
            aria-label={`Ir al video ${index + 1}`}
          />
        ))}
      </div>

      {/* Botones de navegación */}
      <button
        onClick={() => {
          setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
          setIsPlaying(true);
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        aria-label="Video anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => {
          setCurrentIndex((prev) => (prev + 1) % videos.length);
          setIsPlaying(true);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        aria-label="Siguiente video"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}