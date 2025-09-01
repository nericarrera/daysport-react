'use client';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export default function SizeSelector({ 
  sizes, 
  selectedSize, 
  onSelectSize 
}: SizeSelectorProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Talla</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelectSize(size)}
            aria-label={`Talla ${size}`}
            className={`px-5 py-3 rounded-md border-2 font-medium transition-all ${
              selectedSize === size
                ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-200'
                : 'border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}