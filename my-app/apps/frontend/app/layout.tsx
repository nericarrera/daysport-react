import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from './components/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Daysport - Ropa Deportiva',
  description: 'Tienda de ropa deportiva para hombre, mujer y niños',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}