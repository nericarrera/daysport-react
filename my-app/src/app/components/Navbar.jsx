// components/Navbar.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Top banner */}
      <div className="bg-black text-yellow-400 text-center py-2 text-sm">
        ENVIOS A TODO EL PAIS !
      </div>

      {/* Main navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Siempre a la izquierda */}
            <Link href="/" className="flex-shrink-0 order-first">
              <Image
                src="/daysport-transparente-01.png"
                alt="Daysport Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Mobile menu button */}
            {isMobileView && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md focus:outline-none ml-auto"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}

            {/* Desktop menu - Centrado */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-4">
              <div className="flex space-x-8">
                <Link href="/mujer" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium">
                  MUJER
                </Link>
                <Link href="/hombre" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium">
                  HOMBRE
                </Link>
                <Link href="/ninos" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium">
                  NIÑOS
                </Link>
                <Link href="/accesorios" className="text-gray-800 hover:text-blue-600 px-3 py-2 font-medium">
                  ACCESORIOS
                </Link>
              </div>
            </div>

            {/* Icons - Siempre a la derecha */}
            <div className="flex items-center space-x-4 order-last">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="hidden md:block px-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="md:hidden p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Cart */}
              <div className="relative">
                <button className="p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User */}
              <button className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileView && isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/mujer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">
                MUJER
              </Link>
              <Link href="/hombre" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">
                HOMBRE
              </Link>
              <Link href="/ninos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">
                NIÑOS
              </Link>
              <Link href="/accesorios" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">
                ACCESORIOS
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}