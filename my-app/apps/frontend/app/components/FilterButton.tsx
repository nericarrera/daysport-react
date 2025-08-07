'use client';

import { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import FilterModal from './FilterModal';

export default function FilterButton({ category }: { category: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = (filters: any) => {
    console.log('Filters applied:', filters);
    // Aquí conectas con tu API/backend
    // Ejemplo: fetchProducts({ ...filters, category })
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Filtrar</span>
      </button>

      <FilterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        category={category}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
}