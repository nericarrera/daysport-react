"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

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
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Control de visibilidad con animación
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible || !categoryData) return null;

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed left-0 right-0 bg-white shadow-xl z-50 border-t border-gray-200 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        maxHeight: '60vh', // Altura máxima reducida
        overflowY: 'auto'  // Scroll interno
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-6">
          
          {/* Columna de subcategorías */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-900 text-center border-b pb-2">
              {categoryData.name}
            </h3>
            <ul className="space-y-2">
              {categoryData.subcategories.map((subcat) => (
                <li key={subcat.name}>
                  <Link
                    href={subcat.href}
                    className="text-gray-700 hover:text-yellow-500 transition-colors block py-2 px-3 rounded-lg hover:bg-gray-50 text-center text-sm font-medium"
                    onClick={onClose}
                  >
                    {subcat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destacados con imágenes - TAMAÑO CONTROLADO */}
          <div className="col-span-3 grid grid-cols-3 gap-4">
            {categoryData.subcategories
              .filter((sc) => sc.image)
              .map((subcat) => (
                <div key={subcat.name} className="group text-center">
                  <Link href={subcat.href} className="block" onClick={onClose}>
                    <div className="relative aspect-square mb-3 overflow-hidden rounded-lg mx-auto border border-gray-200" 
                         style={{ width: '120px', height: '120px' }}>
                      <Image
                        src={subcat.image || "/default-image.jpg"}
                        alt={subcat.name}
                        width={120}
                        height={120}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{
                          width: '100%',
                          height: '100%',
                          maxWidth: '120px',
                          maxHeight: '120px'
                        }}
                      />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-yellow-500 transition-colors px-2">
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