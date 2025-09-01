'use client';
import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96">
        <span className="text-gray-500">Sin imágenes disponibles</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Layout principal: 2 columnas */}
      <div className="grid grid-cols-2">
        {/* Columna izquierda - Miniaturas */}
        <div className="space-0">
          {images.slice(0, 2).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-full aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === index
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Columna derecha - Imagen principal */}
        <div className="relative aspect-square">
          <img
            src={images[selectedImage]}
            alt={`${productName} - Vista principal`}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Fila adicional de imágenes si hay más de 2 */}
      {images.length > 2 && (
        <div className="grid grid-cols-2 gap-4 pt-4">
          {images.slice(2).map((image, index) => (
            <button
              key={index + 2}
              onClick={() => setSelectedImage(index + 2)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === index + 2
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Miniatura ${index + 3}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}