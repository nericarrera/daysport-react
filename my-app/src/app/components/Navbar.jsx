'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MegaMenu from './components/MegaMenu';

export default function Navbar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // Nuevo estado para el modal del carrito
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartRef = useRef(null);
  const searchRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const userMenuRef = useRef(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = [
  { 
    content: "ENVIOS A TODO EL PAÍS!", 
    style: "text-yellow-400" 
  },
  { 
    content: "¡COMPRA EN 3 CUOTAS SIN INTERÉS!", 
    style: "text-green-400 font-bold" 
  },
  { 
    content: "¡20% DE DESCUENTO EN TU PRIMERA COMPRA!", 
    style: "text-purple-400 animate-pulse" 
  },
];

const categoriesData = {
  mujer: {
    name: 'MUJER',
    href: '/mujer',
    subcategories: [
      { name: 'Remeras', href: '/mujer/remeras', image: '/img/categories/mujer-remeras.jpg' },
      { name: 'Buzos', href: '/mujer/buzos', image: '/img/categories/mujer-buzos.jpg' },
      { name: 'Joggins', href: '/mujer/joggins', image: '/img/categories/mujer-joggins.jpg' },
      { name: 'Shorts', href: '/mujer/shorts', image: '/img/categories/mujer-shorts.jpg' },
      { name: 'Musculosas', href: '/mujer/musculosas', image: '/img/categories/mujer-musculosas.jpg' },
      { name: 'Tops', href: '/mujer/tops', image: '/img/categories/mujer-tops.jpg' },
      { name: 'Calzas', href: '/mujer/calzas', image: '/img/categories/mujer-calzas.jpg' },
      { name: 'Calzado', href: '/mujer/calzado', image: '/img/categories/mujer-calzado.jpg' }
    ]
  },
  hombre: {
    name: 'HOMBRE',
    href: '/hombre',
    subcategories: [
      { name: 'Remeras', href: '/hombre/remeras', image: '/img/categories/hombre-remeras.jpg' },
      { name: 'Buzos', href: '/hombre/buzos', image: '/img/categories/hombre-buzos.jpg' },
      { name: 'Joggins', href: '/hombre/joggins', image: '/img/categories/hombre-joggins.jpg' },
      { name: 'Shorts', href: '/hombre/shorts', image: '/img/categories/hombre-shorts.jpg' },
      { name: 'Camisetas', href: '/hombre/camisetas', image: '/img/categories/hombre-camisetas.jpg' },
      { name: 'Pantalones', href: '/hombre/pantalones', image: '/img/categories/hombre-pantalones.jpg' },
      { name: 'Calzado', href: '/hombre/calzado', image: '/img/categories/hombre-calzado.jpg' }
    ]
  },
  ninos: {
    name: 'NIÑOS',
    href: '/ninos',
    subcategories: [
      { name: 'Remeras', href: '/ninos/remeras', image: '/img/categories/ninos-remeras.jpg' },
      { name: 'Buzos', href: '/ninos/buzos', image: '/img/categories/ninos-buzos.jpg' },
      { name: 'Shorts', href: '/ninos/shorts', image: '/img/categories/ninos-shorts.jpg' },
      { name: 'Calzado', href: '/ninos/calzado', image: '/img/categories/ninos-calzado.jpg' }
    ]
  },
  accesorios: {
    name: 'ACCESORIOS',
    href: '/accesorios',
    subcategories: [
      { name: 'Gorras', href: '/accesorios/gorras', image: '/img/categories/accesorios-gorras.jpg' },
      { name: 'Mochilas', href: '/accesorios/mochilas', image: '/img/categories/accesorios-mochilas.jpg' },
      { name: 'Medias', href: '/accesorios/medias', image: '/img/categories/accesorios-medias.jpg' },
      { name: 'Guantes', href: '/accesorios/guantes', image: '/img/categories/accesorios-guantes.jpg' }
    ]
  }
};
  

  // Cerrar el buscador y el carrito al hacer clic fuera
 useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchOpen(false);
    }
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      setCartOpen(false);
    }
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setUserMenuOpen(false);
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

  // Datos de ejemplo para el carrito (esto luego vendrá de tu CartContext)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Remera Deportiva Mujer',
      price: 5990,
      image: '/img/products/remera-mujer.jpg',
      quantity: 1
    },
    {
      id: 2,
      name: 'Short Deportivo Hombre',
      price: 4990,
      image: '/img/products/short-hombre.jpg',
      quantity: 2
    }
  ]);

  // Calcular total
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // banner show
 useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
  }, 6000); // Cambia cada 3 segundos (ajustable)

  return () => clearInterval(interval);
}, [texts.length]);


  return (
    <>
      {/* Top banner */}
  <div className="bg-black text-center py-3 text-sm relative min-h-[29px] flex items-center justify-center overflow-hidden">
  {texts.map((text, index) => (
    <div
      key={text.content}
      className={`
        absolute w-full transition-all duration-600 transform
        ${currentTextIndex === index ? 
          'translate-y-0 opacity-100' : 
          'translate-y-full opacity-0'
        }
        ${text.style} // Aplica los estilos personalizados
      `}
    >
      {text.content}
    </div>
  ))}
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
                  className="h-7 w-7 text-gray-950"
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
    {Object.entries(categoriesData).map(([key, category]) => (
      <div 
        key={key}
        className="relative"
        onMouseEnter={() => {
          setActiveCategory(key);
          setIsMegaMenuOpen(true);
        }}
      >
        <Link 
          href={category.href} 
          className="text-gray-800 hover:text-yellow-300 px-0 py-2 font-medium whitespace-nowrap"
        >
          {category.name}
        </Link>
      </div>
    ))}
  </div>
</div>

                {/* Barra de búsqueda desplegable */}
                <div className="flex items-center space-x-4">
                  <div className="relative" ref={searchRef}>
                    {/* Icono de búsqueda */}
                    <button 
                      onClick={() => setSearchOpen(!searchOpen)}
                      className="text-gray-600 hover:text-purple-500 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    
                    {/* Input de búsqueda */}
                    {searchOpen && (
                      <div className="absolute right-0 top-full mt-1 w-50 shadow-lg rounded-md p-2 z-50">
                        <input
                          type="text"
                          placeholder="Buscar productos..."
                          className="text-black w-full px-4 py-2 rounded-ullf border bg-amber-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>

                  {/* Cart */}
                  <div className="relative" ref={cartRef}>
                    <button 
                      className="text-black hover:text-purple-500 transition-colors cursor-pointer"
                      onClick={() => setCartOpen(!cartOpen)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </button>

                    {/* Modal del Carrito */}
                    {cartOpen && (
                      <div className={`absolute right-0 top-full mt-1 w-80 md:w-96 text-black bg-white shadow-xl rounded-md z-50 ${isMobileView ? 'fixed inset-0 h-full w-full m-0 rounded-none' : ''}`}>
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-4">Tu Carrito ({cartItems.length})</h3>
                          
                          {/* Lista de productos */}
                          <div className="max-h-60 overflow-y-auto mb-4">
                            {cartItems.length > 0 ? (
                              cartItems.map(item => (
                                <div key={item.id} className="flex items-center py-3 border-b">
                                  <div className="relative w-16 h-16 mr-3">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {item.quantity} x ${item.price.toLocaleString()}
                                    </p>
                                  </div>
                                  <p className="font-semibold">
                                    ${(item.price * item.quantity).toLocaleString()}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-center py-4">Tu carrito está vacío</p>
                            )}
                          </div>

                          {/* Total */}
                          <div className="border-t pt-3 mb-4">
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span>${cartTotal.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Botones */}
                          <div className="flex flex-col space-y-2">
                            <Link 
                              href="/carrito" 
                              className="bg-purple-800 text-white py-2 px-4 rounded text-center hover:bg-purple-500 transition-colors"
                              onClick={() => setCartOpen(false)}
                            >
                              Ver Carrito
                            </Link>
                            <button 
                              className="bg-yellow-400 text-black py-2 px-4 rounded hover:bg-black hover:text-white transition-colors"
                              onClick={() => {
                                // Aquí iría la lógica para proceder al pago
                                console.log('Proceder al pago');
                                setCartOpen(false);
                              }}
                            >
                              Comprar Ahora
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User */}
                  {/* Menú de Usuario */}
<div className="relative" ref={userMenuRef}>
  <button 
    className="text-black mb-2 hover:text-purple-500 transition-colors cursor-pointer"
    onClick={() => setUserMenuOpen(!userMenuOpen)}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 22 22" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </button>

  {userMenuOpen && (
    <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md z-50 cursor-pointer border-t">
      {isLoggedIn ? (
        <>
          <div className="px-4 py-3 border-b hover:bg-yellow-300 cursor-pointer">
            <p className="text-sm font-medium text-black">Hola, Usuario</p>
            <p className="text-xs text-gray-500 truncate">usuario@example.com</p>
          </div>
          <Link 
            href="/mi-cuenta" 
            className="block px-4 py-2 text-sm text-black hover:bg-yellow-300"
            onClick={() => setUserMenuOpen(false)}
          >
            Mi Cuenta
          </Link>
          <Link 
            href="/mis-pedidos" 
            className="block px-4 py-2 text-sm hover:bg-yellow-300 text-black border-t"
            onClick={() => setUserMenuOpen(false)}
          >
            Mis Pedidos
          </Link>
          <button 
            className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-300 text-black border-t"
            onClick={() => setIsLoggedIn(false)}
          >
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <Link 
            href="/iniciar-sesion" 
            className="block px-4 py-3 text-sm font-medium text-black hover:bg-yellow-300"
            onClick={() => setUserMenuOpen(false)}
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/registrarse" 
            className="block px-4 py-3 text-sm text-black hover:bg-yellow-300 border-t"
            onClick={() => setUserMenuOpen(false)}
          >
            Crear Cuenta
          </Link>
        </>
      )}
    </div>
  )}
</div>
                </div>
              </>
            )}

            {/* Mobile icons (solo se muestran en mobile) */}
            {isMobileView && (
              <div className="flex items-center space-x-4">
                {/* Search icon */}
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-black cursor-pointer" 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 25" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Cart */}
                <div className="relative" ref={cartRef}>
                  <button 
                    className=" text-black cursor-pointer"
                    onClick={() => setCartOpen(!cartOpen)}
                  >
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
                <div className="relative" ref={userMenuRef}>
  <button 
    className=" text-black cursor-pointer"
    onClick={() => setUserMenuOpen(!userMenuOpen)}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </button>

  {userMenuOpen && (
    <div className="fixed inset-0 bg-white text-black z-50 overflow-y-auto pt-16">
      <div className="p-4">
        <div className="flex justify-between items-center p-2 mb-6">
          <h3 className="text-xl font-bold">
            {isLoggedIn ? 'Mi Cuenta' : 'Iniciar Sesión'}
          </h3>
          <button 
            onClick={() => setUserMenuOpen(false)}
            className="text-black hover:bg-amber-300 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoggedIn ? (
          <>
            <nav className="space-y-1 text-black justify-center">
              <Link 
                href="/mi-cuenta" 
                className="block py-3 px-2 text-black hover:bg-yellow-400 rounded-lg"
                onClick={() => setUserMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              <Link 
                href="/mis-pedidos" 
                className="block py-3 px-2 text-black hover:bg-yellow-400 rounded-lg"
                onClick={() => setUserMenuOpen(false)}
              >
                Mis Pedidos
              </Link>
            </nav>
            <button 
              className="w-full text-center justify-center mt-6 py-3 px-2 bg-purple-800 text-white rounded-lg hover:bg-black cursor-pointer"
              onClick={() => setIsLoggedIn(false)}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <Link 
                href="/iniciar-sesion" 
                className="block w-full py-3 px-4 bg-yellow-400 text-black rounded-lg text-center font-medium hover:bg-yellow-400"
                onClick={() => setUserMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/registrarse" 
                className="block w-full py-3 px-4 border text-black border-black rounded-lg text-center hover:bg-purple-500"
                onClick={() => setUserMenuOpen(false)}
              >
                Crear Cuenta
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )}
</div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileView && isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/mujer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-yellow-300 transition-colors">
                MUJER
              </Link>
              <Link href="/hombre" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-yellow-300 transition-colors">
                HOMBRE
              </Link>
              <Link href="/ninos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-yellow-300 transition-colors">
                NIÑOS
              </Link>
              <Link href="/accesorios" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-yellow-300 transition-colors">
                ACCESORIOS
              </Link>
            </div>
          </div>
        )}

        {/* Mobile search */}
        {isMobileView && searchOpen && (
          <div className="md:hidden bg-white p-4 text-center">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="justify-center text-center w-medium px-4 py-2 rounded-full border text-black border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              autoFocus
            />
          </div>
        )}

        {/* Mobile Cart Modal */}
        {isMobileView && cartOpen && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto text-black">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Tu Carrito ({cartItems.length})</h3>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="text-black hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Lista de productos */}
              <div className="mb-4 cursor-pointer text-black">
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <div key={item.id} className="flex items-center py-3 border-b">
                      <div className="relative w-16 h-16 mr-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-black">
                          {item.quantity} x ${item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8">Tu carrito está vacío</p>
                )}
              </div>

              {/* Total */}
              {cartItems.length > 0 && (
                <div className="border-t pt-3 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/carrito" 
                    className="bg-gray-950 text-white py-3 px-4 rounded text-center transition-colors"
                    onClick={() => setCartOpen(false)}
                  >
                    Ver Carrito
                  </Link>
                  <button 
                    className="bg-purple-800 text-black py-3 px-4 rounded hover:bg-yellow-300 transition-colors cursor-pointer"
                    onClick={() => {
                      console.log('Proceder al pago');
                      setCartOpen(false);
                    }}
                  >
                    Comprar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      <MegaMenu 
  isOpen={isMegaMenuOpen && !isMobileView} 
  onClose={() => setIsMegaMenuOpen(false)}
  categoryData={activeCategory ? categoriesData[activeCategory] : null}
/>
    </>
  );
}
