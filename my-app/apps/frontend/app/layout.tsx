import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../components/CartContext';
import Header from '../components/Header'; // Ajusta la ruta
import Footer from '../components/Footer'; // Ajusta la ruta

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Daysport - Ropa Deportiva',
  description: 'Tienda de ropa deportiva para hombre, mujer y niños',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <CartProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}