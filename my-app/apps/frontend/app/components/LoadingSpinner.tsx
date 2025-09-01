interface LoadingSpinnerProps {
  productId?: string;
}

export default function LoadingSpinner({ productId }: LoadingSpinnerProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Cargando producto</h2>
        <p className="text-gray-600 mb-4">Estamos preparando todos los detalles para ti...</p>
        {productId && (
          <p className="text-sm text-gray-400">ID: {productId}</p>
        )}
      </div>
    </div>
  );
}