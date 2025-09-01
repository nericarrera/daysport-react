"use client";

import { useEffect, useState } from "react";
import { ProductService } from "@/services/productService";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  mainImageUrl?: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  brand?: string;
  category?: string;
  subcategory?: string;
}

export default function ProductDetailPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(false);
      const data = await ProductService.getProductById(productId);
      if (!data) setError(true);
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando producto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">No se pudo cargar el producto.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* Imagen principal */}
      <div>
        {product.mainImageUrl && (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full max-h-[500px] object-contain rounded-xl shadow-lg"
          />
        )}

        {/* Galería de imágenes */}
        {product.images && product.images.length > 1 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className="w-full h-28 object-cover rounded-md border"
              />
            ))}
          </div>
        )}
      </div>

      {/* Info del producto */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>

        {/* Precio con descuento */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold text-green-600">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-lg line-through text-gray-400">
              ${product.originalPrice}
            </span>
          )}
          {product.discountPercentage && (
            <span className="text-red-500 font-semibold">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Marca / Categoría */}
        <p className="text-sm text-gray-500 mb-2">
          {product.brand && <span>Marca: {product.brand} • </span>}
          {product.category && (
            <span>
              Categoría: {product.category}
              {product.subcategory ? ` / ${product.subcategory}` : ""}
            </span>
          )}
        </p>

        {/* Talles */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-1">Talles disponibles:</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 border rounded-md text-sm cursor-pointer hover:bg-gray-100"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Colores */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-1">Colores:</p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 border rounded-md text-sm cursor-pointer hover:bg-gray-100"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botón */}
        <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}