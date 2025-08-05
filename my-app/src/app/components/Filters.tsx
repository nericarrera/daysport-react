'use client';
import { useState } from 'react';

interface FiltersProps {
  category: string;
}

export default function Filters({ category }: FiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Filtros específicos por categoría
  const filtersByCategory = {
    mujer: ['Tallas', 'Color', 'Tipo de Actividad', 'Material'],
    hombre: ['Tallas', 'Color', 'Estilo', 'Marcas'],
    ninos: ['Edad', 'Tallas', 'Color', 'Personajes'],
    accesorios: ['Tipo', 'Color', 'Marcas', 'Material']
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-bold text-lg mb-4">Filtrar por</h3>
      
      {/* Rango de precios */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Precio</h4>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Filtros específicos */}
      {filtersByCategory[category as keyof typeof filtersByCategory]?.map((filter) => (
        <div key={filter} className="mb-6">
          <h4 className="font-medium mb-2">{filter}</h4>
          {/* Aquí irían los checkboxes/opciones específicas */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Opción 1</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span>Opción 2</span>
            </label>
          </div>
        </div>
      ))}

      <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors">
        Aplicar Filtros
      </button>
    </div>
  );
}