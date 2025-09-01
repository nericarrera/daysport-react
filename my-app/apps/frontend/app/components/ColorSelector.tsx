'use client';

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  colorMap: Record<string, string>;
}

export default function ColorSelector({ 
  colors, 
  selectedColor, 
  onSelectColor, 
  colorMap 
}: ColorSelectorProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            aria-label={`Color ${color}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors ${
              selectedColor === color
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div
              className="w-5 h-5 rounded-full border border-gray-200"
              style={{ backgroundColor: colorMap[color.toLowerCase()] || '#f0f0f0' }}
            />
            <span className="text-sm capitalize">{color}</span>
          </button>
        ))}
      </div>
    </div>
  );
}