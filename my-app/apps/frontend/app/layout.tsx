// apps/frontend/app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/graphql/client';

const inter = Inter({ subsets: ['latin'] });

// Metadata para SEO (reemplaza el Head)
export const metadata = {
  title: 'Daysport - Ropa Deportiva',
  description: 'Tienda de ropa deportiva para hombre, mujer y niños',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ApolloProvider client={client}>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}