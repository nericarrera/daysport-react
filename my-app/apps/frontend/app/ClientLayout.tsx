'use client';

import { CartProvider } from './components/CartContext';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/graphql/client';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </CartProvider>
    </ApolloProvider>
  );
}