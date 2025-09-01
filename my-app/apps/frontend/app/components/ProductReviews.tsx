'use client';
import { useState } from 'react';

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
  rating?: number;
  reviewCount?: number;
}

export default function ProductReviews({ productId, productName, rating = 0, reviewCount = 0 }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      user: 'Ana Martínez',
      rating: 5,
      comment: 'Excelente calidad. La talla es exacta a la guía. Muy cómodo y el material es de primera.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      user: 'Carlos Rodríguez',
      rating: 4,
      comment: 'Buen producto, pero la talla me quedó un poco justa. Recomiendo tallar una talla más.',
      date: '2024-01-10',
      verified: true
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    name: ''
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Reseña enviada! Será publicada después de la moderación.');
    setNewReview({ rating: 0, comment: '', name: '' });
  };

  return (
    <div className="space-y-8">
      {/* Resumen de reseñas */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</div>
            <div className="flex justify-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-1">{reviewCount} reseñas</div>
          </div>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">{review.user}</h4>
                {review.verified && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Compra verificada
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-2">{review.comment}</p>
            <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      {/* Formulario para nueva reseña */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Escribe tu reseña</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="text-2xl focus:outline-none"
                >
                  {star <= newReview.rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu reseña
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Comparte tu experiencia con este producto..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu nombre
            </label>
            <input
              type="text"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre"
            />
          </div>

          <button
            type="submit"
            disabled={!newReview.rating || !newReview.comment || !newReview.name}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Enviar reseña
          </button>
        </form>
      </div>
    </div>
  );
}