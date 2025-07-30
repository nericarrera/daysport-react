'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CategorySelector() {
  const router = useRouter();

  const categories = [
    { id: 'mujer', name: 'Mujer', image: '/img/categories/mujer.jpg' },
    { id: 'hombre', name: 'Hombre', image: '/img/categories/hombre.jpg' },
    { id: 'ninos', name: 'Niños', image: '/img/categories/ninos.jpg' },
    { id: 'zapatillas', name: 'Zapatillas', image: '/img/categories/zapatillas.jpg' },
    { id: 'accesorios', name: 'Accesorios', image: '/img/categories/accesorios.jpg' }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Explora Nuestras Categorías</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => router.push(`/categoria/${category.id}`)}
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-all mb-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}