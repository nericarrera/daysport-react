interface Products {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export async function getFeaturedProducts(category: string): Promise<Products[]> {
  // Datos de ejemplo - reemplaza con tu lógica real
  const mockProducts = {
    mujer: [
      {
        id: '1',
        name: 'Remera Deportiva Mujer',
        price: 5990,
        category: 'mujer',
        image: '/images/products/mujer/remera.jpg'
      }
    ],
    hombre: [
      {
        id: '2',
        name: 'Remera Deportiva Hombre',
        price: 5490,
        category: 'hombre',
        image: '/images/products/hombre/remera.jpg'
      }
    ],
    niños: [
      {
        id: '3',
        name: 'Conjunto Niños',
        price: 4990,
        category: 'niños',
        image: '/images/products/ninos/conjunto.jpg'
      }
    ],
    accesorios: [
      {
        id: '4',
        name: 'Gorra Unisex',
        price: 2990,
        category: 'accesorios',
        image: '/images/products/accesorios/gorra.jpg'
      }
    ]
  };

  return mockProducts[category as keyof typeof mockProducts] || [];
}