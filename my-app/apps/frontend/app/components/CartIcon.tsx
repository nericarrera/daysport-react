'use client';
import Link from 'next/link';
import { useCart } from './CartContext'; // ← Importación CORRECTA

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="relative flex items-center">
      {/* Icono del carrito */}
      <svg className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h9m-9 0a2 2 0 100 4 2 2 0 000-4zm9 0a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      
      {/* Badge con cantidad */}
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
