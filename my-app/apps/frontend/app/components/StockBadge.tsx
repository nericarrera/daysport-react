interface StockBadgeProps {
  isAvailable: boolean;
  stockQuantity: number;
}

export default function StockBadge({ isAvailable, stockQuantity }: StockBadgeProps) {
  if (!isAvailable) {
    return (
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="text-sm text-red-600 font-medium">Sin stock</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-green-500"></span>
      <span className="text-sm text-green-600 font-medium">
        {stockQuantity > 0 ? `${stockQuantity} disponibles` : 'Disponible'}
      </span>
      {stockQuantity > 0 && stockQuantity <= 5 && (
        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
          ¡Últimas unidades!
        </span>
      )}
    </div>
  );
}