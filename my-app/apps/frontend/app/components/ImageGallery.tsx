'use client';

import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  selectedImage: number;
  onSelectImage: (index: number) => void;
}

export default function ImageGallery({ 
  images, 
  productName, 
  selectedImage, 
  onSelectImage 
}: ImageGalleryProps) {
  const mainImage = images.length > 0 ? images[selectedImage] : '/placeholder-product.jpg';

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-md">
        <Image
          src={mainImage}
          alt={productName}
          fill
          className="object-cover"
          priority
          unoptimized={true}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Galería de miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              aria-label={`Vista ${index + 1} de ${productName}`}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                selectedImage === index
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Vista ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={true}
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}