'use client';
import { Product } from '../types/product'; 

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  className?: string;
  quantity?: number;
}

export default function AddToCartButton({ 
  product, 
  disabled = false, 
  className = '',
  quantity = 1 
}: AddToCartButtonProps) {
  
  const handleAddToCart = () => {
    if (disabled) return;
    
    console.log('Agregando al carrito:', {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.mainImage || product.images[0]
    });
    
    // Aquí irá la lógica real del carrito
    // Puedes usar context, redux, o localStorage
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={`Agregar ${product.name} al carrito`}
    >
      {disabled ? (
        <>
          <span>❌ Agotado</span>
        </>
      ) : (
        <>
          <span>🛒 Agregar al Carrito</span>
        </>
      )}
    </button>
  );
}