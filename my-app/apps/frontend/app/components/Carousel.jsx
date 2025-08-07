'use client';
import { useState } from 'react';

export default function Carousel({
  title,
  items,
  renderItem,
  itemsToShow = 4
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(items.length - itemsToShow, 0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1));
  };

  return (
    <div className="my-8 mx-auto max-w-7xl px-4">
      {title && <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>}
      <div className="relative">
        {maxIndex > 0 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Anterior"
            >
              ❮
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Siguiente"
            >
              ❯
            </button>
          </>
        )}
        
        <div className="flex overflow-hidden">
          <div 
            className="flex transition-transform duration-300"
            style={{ 
              transform: `translateX(-${currentIndex * (100/itemsToShow)}%)`,
              width: `${items.length * (100/itemsToShow)}%`
            }}
          >
            {items.map((item, index) => (
              <div 
                key={index} 
                className={`flex-shrink-0`}
                style={{ width: `${100/itemsToShow}%` }}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}