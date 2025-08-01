'use client';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  name: string;
  href: string;
  subcategories: {
    name: string;
    href: string;
    image?: string;
  }[];
}

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData: Category | null;
}

export default function MegaMenu({ isOpen, onClose, categoryData }: MegaMenuProps) {
  if (!isOpen || !categoryData) return null;

  return (
    <div 
      className="fixed left-0 right-0 bg-white shadow-xl z-40 border-t border-gray-200"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Columna de subcategorías */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-900">{categoryData.name}</h3>
            <ul className="space-y-3">
              {categoryData.subcategories.map((subcat) => (
                <li key={subcat.name}>
                  <Link 
                    href={subcat.href} 
                    className="text-gray-700 hover:text-yellow-500 transition-colors block py-1"
                  >
                    {subcat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Destacados */}
          <div className="col-span-3 grid grid-cols-3 gap-6">
            {categoryData.subcategories.filter(sc => sc.image).map((subcat) => (
              <div key={subcat.name} className="group">
                <Link href={subcat.href} className="block">
                  <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
                    <Image
                      src={subcat.image || '/default-image.jpg'}
                      alt={subcat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-gray-900 font-medium group-hover:text-yellow-500 transition-colors">
                    {subcat.name}
                  </h4>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}