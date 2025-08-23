'use client';

import { useCart } from './CartContext';

interface AddToCartButtonProps {
  product: {
    id: number;       // ← Cambié de string a number para coincidir con tu DB
    name: string;
    price: number;
    images: string[];
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(), // ← Convertimos a string para coincidir con tu contexto
      name: product.name,
      price: product.price,
      image: product.images[0] || '/images/placeholder.jpg',
      // quantity: 1 ← No necesario, el contexto lo agrega automáticamente
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
    >
      🛒 Agregar al Carrito
    </button>
  );
}