interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  className?: string;
}

export default function PriceDisplay({ price, originalPrice, className = '' }: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-green-600">
          ${price}
        </span>
        
        {hasDiscount && (
          <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
            {discountPercentage}% OFF
          </span>
        )}
      </div>
      
      {hasDiscount && (
        <div className="mt-1">
          <span className="text-lg text-gray-500 line-through">
            ${originalPrice}
          </span>
          <span className="ml-2 text-sm text-gray-600">
            Ahorras ${originalPrice - price}
          </span>
        </div>
      )}
    </div>
  );
}