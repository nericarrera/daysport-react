'use client';
import { useState } from 'react';

export default function Filters({ category }: { category: string }) {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  
  // Filtros específicos por categoría
  const categoryFilters = {
    mujer: ['Tallas', 'Color', 'Tipo de Actividad'],
    hombre: ['Tallas', 'Color', 'Estilo'],
    ninos: ['Edad', 'Tallas', 'Color'],
    accesorios: ['Tipo', 'Color']
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-bold text-lg mb-4">Filtrar por</h3>
      
      {/* Rango de precios */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Precio</h4>
        <div className="flex items-center justify-between gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full border rounded p-2"
          />
          <span>a</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Filtros específicos */}
      {categoryFilters[category as keyof typeof categoryFilters]?.map((filter) => (
        <div key={filter} className="mb-6">
          <h4 className="font-medium mb-2">{filter}</h4>
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Opción {item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors">
        Aplicar Filtros
      </button>
    </div>
  );
}