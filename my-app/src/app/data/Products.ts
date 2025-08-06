export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'mujer' | 'hombre' | 'niños' | 'accesorios';
  image: string;
  featured?: boolean;
  sizes?: string[];
  colors?: string[];
}

export const allProducts: Product[] = [
  {
    id: '1',
    name: 'Remera Mujer',
    price: 5990,
    category: 'mujer',
    image: '/images/mujer/remera.jpg',
    featured: true,
    sizes: ['S', 'M', 'L'],
    colors: ['Negro', 'Blanco']
  },
  // ... agregar más productos para todas las categorías
];

// Obtener productos por categoría
export const getProductsByCategory = (category: Product['category']) => {
  return allProducts.filter(product => product.category === category);
};

// Obtener productos destacados (alternativa a getFeaturedProducts)
export const getFeaturedProducts = (category: Product['category']) => {
  return allProducts.filter(product => 
    product.category === category && product.featured
  ).slice(0, 8); // Limitar a 8 productos
};