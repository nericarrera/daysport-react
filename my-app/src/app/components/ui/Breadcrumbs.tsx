import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
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
        
        {items.map((item, index) => (
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