"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";

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

  // 🔒 BLOQUEAR SCROLL DEL BODY CUANDO EL MENÚ ESTÁ ABIERTO
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    };
  }, [isOpen]);

  if (!isOpen || !categoryData) return null;

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div
      className="fixed left-0 right-0 bg-white shadow-xl z-50 border-t border-gray-200 top-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-8">
          {/* Columna de subcategorías - MÁS ESTILO */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-6 text-gray-900 text-center border-b pb-3">
              {categoryData.name}
            </h3>
            <ul className="space-y-3">
              {categoryData.subcategories.map((subcat) => (
                <li key={subcat.name}>
                  <Link
                    href={subcat.href}
                    className="text-gray-700 hover:text-yellow-500 transition-colors block py-2 px-4 rounded-lg hover:bg-gray-50 text-center font-medium"
                    onClick={onClose}
                  >
                    {subcat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destacados con imágenes - TAMAÑO CONTROLADO */}
          <div className="col-span-3 grid grid-cols-3 gap-6">
            {categoryData.subcategories
              .filter((sc) => sc.image)
              .map((subcat) => (
                <div key={subcat.name} className="group text-center">
                  <Link href={subcat.href} className="block" onClick={onClose}>
                    <div className="relative aspect-square mb-3 overflow-hidden rounded-lg mx-auto border border-gray-200">
                      <Image
                        src={subcat.image || "/default-image.jpg"}
                        alt={subcat.name}
                        width={160} // ← TAMAÑO CONTROLADO
                        height={160} // ← TAMAÑO CONTROLADO
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{
                          width: '100%',
                          height: '100%',
                          maxWidth: '160px',
                          maxHeight: '160px'
                        }}
                      />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-yellow-500 transition-colors">
                      {subcat.name}
                    </h4>
                  </Link>
                </div>
              ))}
          </div>
        </div>

        {/* BOTÓN DE CERRAR PARA MÓVIL */}
        <div className="lg:hidden mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar menú
          </button>
        </div>
      </div>
    </div>
  );
}