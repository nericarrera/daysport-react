// components/Navbar.js
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Cerrar el buscador al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <div className="max-w-7xl mx-auto px-4 pl-6">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button */}
            {isMobileView && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md focus:outline-none"
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

            {/* Logo - Centrado en mobile */}
            {isMobileView && (
              <Link href="/" className="mx-auto">
                <Image
                  src="/daysport-transparente-02.png"
                  alt="Daysport Logo"
                  width={120}
                  height={40}
                  className="h-18 w-18"
                />
              </Link>
            )}

            {/* Desktop layout */}
            {!isMobileView && (
              <>
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                  <Image
                    src="/daysport-transparente-02.png"
                    alt="Daysport Logo"
                    width={120}
                    height={40}
                    className="h-18 w-18"
                  />
                </Link>

                {/* Menú central */}
                <div className="flex-1 flex justify-center px-4">
                  <div className="flex space-x-6 text-left">
                    <Link href="/mujer" className="text-gray-800 hover:text-blue-600 px-0 py-2 font-medium whitespace-nowrap">
                      MUJER
                    </Link>
                    <Link href="/hombre" className="text-gray-800 hover:text-blue-600 px-0 py-2 font-medium whitespace-nowrap">
                      HOMBRE
                    </Link>
                    <Link href="/ninos" className="text-gray-800 hover:text-blue-600 px-0 py-2 font-medium whitespace-nowrap">
                      NIÑOS
                    </Link>
                    <Link href="/accesorios" className="text-gray-800 hover:text-blue-600 px-0 py-2 font-medium whitespace-nowrap">
                      ACCESORIOS
                    </Link>
                  </div>
                </div>

                {/* Barra de búsqueda desplegable */}
                <div className="flex items-center space-x-4">
                  <div className="relative" ref={searchRef}>
                    {/* Icono de búsqueda */}
                    <button 
                      onClick={() => setSearchOpen(!searchOpen)}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    
                    {/* Input de búsqueda (se muestra cuando searchOpen es true) */}
                    {searchOpen && (
                      <div className="absolute right-0 top-full mt-1 w-64 bg-purple-950 shadow-lg rounded-md p-2 z-10">
                        <input
                          type="text"
                          placeholder="Buscar productos..."
                          className="text-black w-full px-4 py-2 rounded-full border bg-amber-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>

                  {/* Cart */}
                  <div className="relative">
                    <button className=" text-black">
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
                  <button className="p-1 text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 22 22" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* Mobile icons (solo se muestran en mobile) */}
            {isMobileView && (
              <div className="flex items-center space-x-4">
                {/* Search icon */}
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-black" 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Cart */}
                <div className="relative">
                  <button className="p-2 text-black">
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
              </div>
            )}
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

        {/* Mobile search (se muestra cuando searchOpen es true) */}
        {isMobileView && searchOpen && (
          <div className="md:hidden bg-white p-4 text-center">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="justify-center text-center w-medium px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              autoFocus
            />
          </div>
        )}
      </nav>
    </>
  );
}