interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export async function getFeaturedProducts(category: string): Promise<Product[]> {
  // En un proyecto real, esto vendría de tu API o base de datos
  const mockProducts: Record<string, Product[]> = {
    mujer: [
      {
        id: 'm1',
        name: 'Buzo Mujer Sport',
        price: 8990,
        image: '/img/mujer/buzos/buzo1.jpg',
        category: 'buzos'
      },
      // más productos...
    ],
    hombre: [
      {
        id: 'h1',
        name: 'Remera Hombre Fit',
        price: 4990,
        image: '/img/hombre/remeras/remera1.jpg',
        category: 'remeras'
      },
      // más productos...
    ],
    niños: [
      {
        id: 'n1',
        name: 'Conjunto Niño',
        price: 7590,
        image: '/img/niños/conjuntos/conjunto1.jpg',
        category: 'conjuntos'
      },
      // más productos...
    ]
  };

  return mockProducts[category] || [];
}