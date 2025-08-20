'use client';

interface FiltersProps {
  category: string;
  onFilterChange?: (subcategory: string) => void; // ← Hacer opcional
  selectedSubcategory?: string; // ← Hacer opcional
}

// Mapeo de subcategorías por categoría principal
const subcategoriesMap: { [key: string]: string[] } = {
  mujer: ['remeras', 'shorts', 'calzas', 'buzos', 'zapatillas'],
  hombre: ['remeras', 'shorts', 'bermudas', 'buzos', 'zapatillas'],
  niños: ['remeras', 'shorts', 'conjuntos', 'zapatillas'],
  accesorios: ['hidratacion', 'medias', 'gorras', 'mochilas']
};

export default function Filters({ category, onFilterChange, selectedSubcategory }: FiltersProps) {
  const subcategories = subcategoriesMap[category] || [];

  // Si no hay onFilterChange, es porque es la versión vieja
  const isLegacyVersion = !onFilterChange;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4">Filtrar por</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">Categorías</h4>
          <div className="space-y-2">
            {/* Versión nueva con filtros funcionales */}
            {!isLegacyVersion && (
              <>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="subcategory"
                    value=""
                    checked={selectedSubcategory === ''}
                    onChange={() => onFilterChange!('')}
                    className="mr-2"
                  />
                  <span>Todas las categorías</span>
                </label>
                
                {subcategories.map((subcat) => (
                  <label key={subcat} className="flex items-center">
                    <input
                      type="radio"
                      name="subcategory"
                      value={subcat}
                      checked={selectedSubcategory === subcat}
                      onChange={() => onFilterChange!(subcat)}
                      className="mr-2"
                    />
                    <span className="capitalize">{subcat}</span>
                  </label>
                ))}
              </>
            )}

            {/* Versión vieja (solo visual) */}
            {isLegacyVersion && (
              <>
                <div className="text-gray-700 py-1">Todas las categorías</div>
                {subcategories.map((subcat) => (
                  <div key={subcat} className="text-gray-700 py-1 capitalize">
                    {subcat}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Puedes agregar más filtros aquí (precio, talles, etc.) */}
      </div>
    </div>
  );
}