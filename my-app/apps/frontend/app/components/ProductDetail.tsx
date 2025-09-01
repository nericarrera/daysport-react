'use client';


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  mainImageUrl?: string;
  images?: string[];
}

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {product.mainImageUrl && (
        <img
          src={product.mainImageUrl}
          alt={product.name}
          className="w-full max-h-[400px] object-contain rounded-lg shadow"
        />
      )}

      <p className="mt-4 text-lg">{product.description}</p>
      <p className="mt-2 text-2xl font-semibold text-green-600">
        ${product.price}
      </p>

      {product.images && product.images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name} ${idx + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}