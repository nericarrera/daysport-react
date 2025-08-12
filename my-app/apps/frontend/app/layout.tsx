'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/graphql/client';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <Head>
        <title>Daysport - Ropa Deportiva</title>
        <meta name="description" content="Tienda de ropa deportiva para hombre, mujer y niños" />
      </Head>
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