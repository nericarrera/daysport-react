'use client';
import { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MegaMenu from './MegaMenu';
import { categories } from './Category';

// Tipos para el contexto de usuario
type User = {
  name: string;
  email: string;
  // Agrega más propiedades según necesites
};

type UserContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

// Creamos un contexto tipado para el usuario
const UserContext = createContext<UserContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {}
});

export const useUser = () => useContext(UserContext);

// Tipo para los items del carrito
type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function Navbar() {
  // Estados
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isHoveringMegaMenu, setIsHoveringMegaMenu] = useState(false);
  
  // Refs
  const cartRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  // Manejo de sesión de usuario
  const [userState, setUserState] = useState<{ isLoggedIn: boolean; user: User | null }>({
    isLoggedIn: false,
    user: null
  });

  const login = useCallback((userData: User) => {
    setUserState({ isLoggedIn: true, user: userData });
  }, []);

  const logout = useCallback(() => {
    setUserState({ isLoggedIn: false, user: null });
  }, []);

  // Textos animados del banner
  const texts = [
    { content: "ENVIOS A TODO EL PAÍS!", style: "text-yellow-400" },
    { content: "¡COMPRA EN 3 CUOTAS SIN INTERÉS!", style: "text-green-400 font-bold" },
    { content: "¡20% DE DESCUENTO EN TU PRIMERA COMPRA!", style: "text-purple-400 animate-pulse" },
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Datos del carrito
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Remera Deportiva Mujer', price: 5990, image: '/img/products/remera-mujer.jpg', quantity: 1 },
    { id: 2, name: 'Short Deportivo Hombre', price: 4990, image: '/img/products/short-hombre.jpg', quantity: 2 }
  ]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Efectos
  useEffect(() => {
    // Limpieza de timeouts al desmontar
    return () => {
      if (megaMenuTimeout.current) {
        clearTimeout(megaMenuTimeout.current);
      }
    };
  }, []);

  // Cierre de menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (megaMenuRef.current && !megaMenuRef.current.contains(target)) {
        setIsMegaMenuOpen(false);
        setActiveCategory(null);
      }
      if (searchRef.current && !searchRef.current.contains(target)) setSearchOpen(false);
      if (cartRef.current && !cartRef.current.contains(target)) setCartOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(target)) setUserMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detección de vista móvil
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Rotador de banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex(prev => (prev + 1) % texts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [texts.length]);

  // Manejadores de eventos
  const handleCategoryHover = useCallback((index: number) => {
    clearTimeout(megaMenuTimeout.current!);
    setActiveCategory(index);
    setIsMegaMenuOpen(true);
    setIsHoveringMegaMenu(false);
  }, []);

  const handleCategoryLeave = useCallback(() => {
    megaMenuTimeout.current = setTimeout(() => {
      if (!isHoveringMegaMenu) {
        setIsMegaMenuOpen(false);
        setActiveCategory(null);
      }
    }, 200);
  }, [isHoveringMegaMenu]);

  const handleMegaMenuEnter = useCallback(() => {
    clearTimeout(megaMenuTimeout.current!);
    setIsHoveringMegaMenu(true);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    setIsHoveringMegaMenu(false);
    setIsMegaMenuOpen(false);
    setActiveCategory(null);
  }, []);

  return (
    <UserContext.Provider value={{ ...userState, login, logout }}>
      <>
        {/* Top banner */}
        <div className="bg-black text-center py-3 text-sm relative min-h-[29px] flex items-center justify-center overflow-hidden">
          {texts.map((text, index) => (
            <div
              key={text.content}
              className={`
                absolute w-full transition-all duration-600 transform
                ${currentTextIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                ${text.style}
              `}
            >
              {text.content}
            </div>
          ))}
        </div>

        {/* Main navbar */}
        <nav className="bg-white shadow-md relative" ref={megaMenuRef}>
          <div className="max-w-7xl mx-auto px-4 pl-6">
            <div className="flex justify-between items-center h-18">
              {/* Mobile menu button */}
              {isMobileView && (
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="md:hidden p-2 rounded-md focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <svg className="h-7 w-7 text-gray-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              )}

              {/* Logo */}
              <Link href="/" className={isMobileView ? "mx-auto" : "flex-shrink-0"} aria-label="Home">
                <Image 
                  src="/daysport-transparente-02.png" 
                  alt="Daysport Logo" 
                  width={120} 
                  height={40} 
                  className="h-18 w-18"
                  priority
                />
              </Link>

              {/* Desktop layout */}
              {!isMobileView && (
                <>
                  {/* Menú central */}
                  <div className="flex-1 flex justify-center px-4 mt-5">
                    <div className="flex space-x-8">
                      {categories.map((category, index) => (
                        <div 
                          key={category.name}
                          className="relative"
                          onMouseEnter={() => handleCategoryHover(index)}
                          onMouseLeave={handleCategoryLeave}
                        >
                          <Link 
                            href={category.href} 
                            className="text-gray-800 hover:text-yellow-500 px-0 py-2 font-medium whitespace-nowrap transition-colors"
                            aria-label={category.name}
                          >
                            {category.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Barra de búsqueda, carrito y usuario desktop */}
                  <div className="flex items-center space-x-4 mt-5">
                    {/* Buscador */}
                    <div className="relative" ref={searchRef}>
                      <button 
                        onClick={() => setSearchOpen(!searchOpen)} 
                        className="text-gray-600 hover:text-purple-500 transition-colors cursor-pointer"
                        aria-label="Search"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                      {searchOpen && (
                        <div className="absolute right-0 top-full mt-1 w-50 shadow-lg rounded-md p-2 z-50 bg-white">
                          <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="text-black w-full px-4 py-2 rounded-full border bg-amber-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                            autoFocus
                            aria-label="Search input"
                          />
                        </div>
                      )}
                    </div>

                    {/* Carrito desktop */}
                    <div className="relative" ref={cartRef}>
                      <button 
                        className="text-black hover:text-purple-500 transition-colors cursor-pointer relative" 
                        onClick={() => setCartOpen(!cartOpen)}
                        aria-label="Cart"
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

                      {/* Modal carrito desktop */}
                      {cartOpen && (
                        <div className={`absolute right-0 top-full mt-1 w-80 md:w-96 text-black bg-white shadow-xl rounded-md z-50 ${isMobileView ? 'fixed inset-0 h-full w-full m-0 rounded-none' : ''}`}>
                          <div className="p-4">
                            <h3 className="text-lg font-bold mb-4">Tu Carrito ({cartItems.length})</h3>
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
                                        sizes="64px"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium">{item.name}</h4>
                                      <p className="text-sm text-gray-600">{item.quantity} x ${item.price.toLocaleString()}</p>
                                    </div>
                                    <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-center py-4">Tu carrito está vacío</p>
                              )}
                            </div>

                            <div className="border-t pt-3 mb-4">
                              <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>${cartTotal.toLocaleString()}</span>
                              </div>
                            </div>

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
                                onClick={() => { console.log('Proceder al pago'); setCartOpen(false); }}
                              >
                                Comprar Ahora
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Menú usuario desktop */}
                    <div className="relative" ref={userMenuRef}>
                      <button 
                        className="text-black mb-2 hover:text-purple-500 transition-colors cursor-pointer"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        aria-label="User menu"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 22 22" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>

                      {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md z-50 cursor-pointer border-t">
                          {userState.isLoggedIn ? (
                            <>
                              <div className="px-4 py-3 border-b hover:bg-yellow-300 cursor-pointer">
                                <p className="text-sm font-medium text-black">Hola, {userState.user?.name || 'Usuario'}</p>
                                <p className="text-xs text-gray-500 truncate">{userState.user?.email || 'usuario@example.com'}</p>
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
                                onClick={() => { logout(); setUserMenuOpen(false); }}
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

              {/* Mobile icons */}
              {isMobileView && (
                <div className="flex items-center space-x-4">
                  {/* Search icon */}
                  <button 
                    onClick={() => setSearchOpen(!searchOpen)} 
                    className="text-black cursor-pointer mb-1"
                    aria-label="Search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 25" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>

                  {/* Cart icon mobile */}
                  <div className="relative" ref={cartRef}>
                    <button 
                      className="text-black cursor-pointer relative" 
                      onClick={() => setCartOpen(!cartOpen)}
                      aria-label="Cart"
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

                  {/* User menu mobile */}
                  <div className="relative" ref={userMenuRef}>
                    <button 
                      className="text-black cursor-pointer"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      aria-label="User menu"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>

                    {userMenuOpen && (
                      <div className="fixed inset-0 bg-white text-black z-50 overflow-y-auto pt-16 p-4">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold">{userState.isLoggedIn ? 'Mi Cuenta' : 'Iniciar Sesión'}</h3>
                          <button 
                            onClick={() => setUserMenuOpen(false)} 
                            className="text-black hover:bg-amber-300 cursor-pointer p-1 rounded"
                            aria-label="Close menu"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {userState.isLoggedIn ? (
                          <>
                            <Link 
                              href="/mi-cuenta" 
                              className="block py-3 px-4 text-black hover:bg-yellow-400 rounded-lg mb-2" 
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Mi Perfil
                            </Link>
                            <Link 
                              href="/mis-pedidos" 
                              className="block py-3 px-4 text-black hover:bg-yellow-400 rounded-lg mb-4" 
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Mis Pedidos
                            </Link>
                            <button 
                              className="w-full py-3 px-4 bg-purple-800 text-white rounded-lg hover:bg-black cursor-pointer" 
                              onClick={() => { logout(); setUserMenuOpen(false); }}
                            >
                              Cerrar Sesión
                            </button>
                          </>
                        ) : (
                          <>
                            <Link 
                              href="/iniciar-sesion" 
                              className="block w-full py-3 px-4 bg-yellow-400 text-black rounded-lg text-center font-medium mb-2" 
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
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* MegaMenu desktop */}
        {!isMobileView && isMegaMenuOpen && activeCategory !== null && (
          <div 
            className="absolute left-0 right-0 bg-white shadow-lg z-40 border-t border-gray-200"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
            style={{
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              transform: isMegaMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
              opacity: isMegaMenuOpen ? 1 : 0,
              pointerEvents: isMegaMenuOpen ? 'auto' : 'none'
            }}
          >
            <div className="max-w-7xl mx-auto px-8 py-6">
              <div className="grid grid-cols-4 gap-8">
                {/* Subcategorías */}
                <div className="col-span-1">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">{categories[activeCategory].name}</h3>
                  <ul className="space-y-3">
                    {categories[activeCategory].subcategories.map((subcat) => (
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
  {categories[activeCategory].subcategories
    .filter(subcat => subcat.image) // Filtramos primero los que tienen imagen
    .map((subcat) => {
      // Aseguramos que image existe y es string
      const imageSrc = subcat.image || '/default-image-path.jpg';
      return (
        <div key={subcat.name} className="group">
          <Link href={subcat.href} className="block">
            <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
              <Image 
                src={imageSrc} 
                alt={subcat.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h4 className="text-gray-900 font-medium group-hover:text-yellow-500 transition-colors">
              {subcat.name}
            </h4>
          </Link>
        </div>
      );
    })}
</div>
              </div>
            </div>
          </div>
        )}
      </>
    </UserContext.Provider>
  );
}