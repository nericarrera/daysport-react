// apps/frontend/app/producto/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ProductService } from '../../../services/productService';
import { Product } from '../../Types';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        const productData = await ProductService.getProductById(Number(params.id));
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Producto no encontrado</p>
        </div>
      </div>
    );
  }

  const getColorHex = (color: string): string => {
    const colorMap: Record<string, string> = {
      'negro': '#000000', 'blanco': '#ffffff', 'rojo': '#ff0000',
      'azul': '#0000ff', 'verde': '#00ff00', 'gris': '#808080',
      'amarillo': '#ffff00', 'rosa': '#ffc0cb', 'morado': '#800080',
      'naranja': '#ffa500', 'marron': '#a52a2a', 'beige': '#f5f5dc'
    };
    return colorMap[color.toLowerCase()] || '#f0f0f0';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-96 mb-4">
            <Image
              src={product.images[selectedImage] || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className="relative h-20 w-20"
              >
                <Image
                  src={image}
                  alt={`Vista ${index + 1} de ${product.name}`}
                  fill
                  className="object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-green-600 font-bold mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mb-4">
              <label className="block font-medium mb-2">Talla:</label>
              <div className="flex gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block font-medium mb-2">Color:</label>
              <div className="flex gap-2">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: selectedColor === color ? getColorHex(color) : 'transparent',
                      color: selectedColor === color ? '#fff' : '#000'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors">
            Agregar al Carrito
          </button>

          <div className="mt-6 text-sm text-gray-600">
            <p className={`mb-2 ${
              product.stock > 10 ? 'text-green-600' : 
              product.stock > 0 ? 'text-orange-600' : 'text-red-600'
            }`}>
              Stock disponible: {product.stock} unidades
            </p>
            <p className="mb-1">✓ Envíos a todo el país</p>
            <p className="mb-1">✓ Devoluciones gratuitas</p>
            <p>✓ Garantía de 30 días</p>
          </div>
        </div>
      </div>
    </div>
  );
}