'use client';

interface ErrorDisplayProps {
  error: string;
  productId?: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ error, productId, onRetry }: ErrorDisplayProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar el producto</h1>
        <p className="text-gray-600 mb-4">{error || 'Producto no encontrado'}</p>
        
        {productId && (
          <p className="text-sm text-gray-500 mb-6">ID solicitado: {productId}</p>
        )}

        <div className="space-x-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          )}
          <button
            onClick={() => window.history.back()}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver atrás
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-800 underline px-6 py-2"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}