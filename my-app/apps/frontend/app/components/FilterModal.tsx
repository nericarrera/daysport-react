// components/FilterModal.tsx
'use client';
import { useState } from 'react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface FilterValues {
  sizes: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
  sort: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onApplyFilters: (filters: FilterValues) => void;
}

const SIZE_OPTIONS = {
  mujer: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  hombre: ['S', 'M', 'L', 'XL', 'XXL'],
  niños: ['6', '7', '8', '9', '10', '12', '14', '16'],
  jeans: ['38', '40', '42', '44', '46', '48', '50', '52', '54', '56'],
  especiales: ['6', '7', '8', '9', '10'],
  accesorios: ['Único']
};

const COLOR_OPTIONS = [
  'Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 
  'Gris', 'Rosa', 'Amarillo', 'Multicolor'
];

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'popular', label: 'Más vendidos' },
  { value: 'newest', label: 'Novedades' }
];

export default function FilterModal({ isOpen, onClose, category, onApplyFilters }: FilterModalProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOption, setSortOption] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      sizes: selectedSizes,
      colors: selectedColors,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      sort: sortOption
    });
    onClose();
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(prev => prev === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-t-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {/* Ordenar */}
              <div className="mb-6">
                <button 
                  onClick={() => toggleAccordion('sort')}
                  className="flex justify-between items-center w-full py-2 text-left font-medium"
                >
                  <span>Ordenar por</span>
                  <ChevronDownIcon className={`h-5 w-5 transform ${activeAccordion === 'sort' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'sort' && (
                  <div className="mt-2 space-y-2">
                    {SORT_OPTIONS.map(option => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortOption === option.value}
                          onChange={() => setSortOption(option.value)}
                          className="rounded"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Rango de Precio */}
              <div className="mb-6">
                <button 
                  onClick={() => toggleAccordion('price')}
                  className="flex justify-between items-center w-full py-2 text-left font-medium"
                >
                  <span>Rango de Precio</span>
                  <ChevronDownIcon className={`h-5 w-5 transform ${activeAccordion === 'price' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'price' && (
                  <div className="mt-2 flex items-center justify-between gap-2 mb-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full border rounded p-2"
                      placeholder="Mínimo"
                    />
                    <span>a</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full border rounded p-2"
                      placeholder="Máximo"
                    />
                  </div>
                )}
              </div>

              {/* Tallas */}
              <div className="mb-6">
                <button 
                  onClick={() => toggleAccordion('sizes')}
                  className="flex justify-between items-center w-full py-2 text-left font-medium"
                >
                  <span>Tallas</span>
                  <ChevronDownIcon className={`h-5 w-5 transform ${activeAccordion === 'sizes' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'sizes' && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {SIZE_OPTIONS[category as keyof typeof SIZE_OPTIONS]?.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`py-2 px-3 border rounded-full text-sm ${
                          selectedSizes.includes(size) 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-800 border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Colores */}
              <div className="mb-6">
                <button 
                  onClick={() => toggleAccordion('colors')}
                  className="flex justify-between items-center w-full py-2 text-left font-medium"
                >
                  <span>Colores</span>
                  <ChevronDownIcon className={`h-5 w-5 transform ${activeAccordion === 'colors' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'colors' && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {COLOR_OPTIONS.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`py-2 px-3 border rounded-full text-sm ${
                          selectedColors.includes(color) 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-800 border-gray-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleApply}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}