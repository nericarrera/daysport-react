// components/Breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

// Mapeo de nombres para categorías principales
const CATEGORY_NAMES: Record<string, string> = {
  mujer: 'Mujer',
  hombre: 'Hombre',
  ninos: 'Ninos',
  accesorios: 'Accesorios',
  // Agrega más categorías según necesites
};

interface BreadcrumbsProps {
  className?: string;
  customNames?: Record<string, string>; // Para sobrescribir nombres específicos
}

export default function Breadcrumbs({ className = '', customNames = {} }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Generamos los breadcrumbs dinámicamente
  const breadcrumbs = generateBreadcrumbs(pathname, { ...CATEGORY_NAMES, ...customNames });

  // No mostrar si estamos en la página de inicio
  if (breadcrumbs.length === 0) return null;

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Inicio
          </Link>
        </li>
        
        {breadcrumbs.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <Link
              href={item.href}
              className={`ml-1 text-sm font-medium ${item.active 
                ? 'text-gray-800 pointer-events-none' 
                : 'text-gray-500 hover:text-gray-700'
              } md:ml-2`}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Función helper para generar los breadcrumbs
function generateBreadcrumbs(pathname: string, nameMap: Record<string, string>) {
  const paths = pathname.split('/').filter(Boolean);
  
  return paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`;
    const isLast = index === paths.length - 1;
    
    // Formateamos el nombre del path
    const label = nameMap[path] || 
                  path.replace(/-/g, ' ')
                      .replace(/\b\w/g, l => l.toUpperCase());

    return {
      label,
      href,
      active: isLast
    };
  });
}