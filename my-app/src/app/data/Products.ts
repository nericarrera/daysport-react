interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  // ... otras propiedades
}

export async function getFeaturedProducts(category: string): Promise<Product[]> {
  // Datos mock - reemplaza con tu lógica real
  const allProducts = [
    {
      id: '1',
      name: 'Remera Deportiva Mujer',
      price: 5990,
      category: 'mujer',
      image: '/images/products/mujer/remera.jpg'
    },
    {
      id: '2',
      name: 'Short Deportivo Hombre',
      price: 4990,
      category: 'hombre',
      image: '/images/products/hombre/short.jpg'
    },
    // ... más productos
  ];

  return allProducts.filter(product => product.category === category);
}