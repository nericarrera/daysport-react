export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'mujer' | 'hombre' | 'niños' | 'accesorios';
  image: string;
  featured?: boolean;
  sizes?: string[];
  colors?: string[];
  subcategory?: string;
}

// Nuevo tipo para productos compatibles
export interface CompatibleProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  featured?: boolean;
  sizes?: string[];
  colors?: string[];
}

export const allProducts: Product[] = [
  {
    id: '1',
    name: 'Remera Deportiva Mujer Running',
    price: 5990,
    category: 'mujer',
    image: '/images/mujer/remera.jpg',
    featured: true,
    sizes: ['S', 'M', 'L'],
    colors: ['Negro', 'Blanco'],
    subcategory: 'remeras'
  },
  {
    id: '2', 
    name: 'Short Deportivo Hombre',
    price: 4990,
    category: 'hombre',
    image: '/images/hombre/short.jpg',
    featured: true,
    sizes: ['M', 'L', 'XL'],
    colors: ['Negro', 'Gris'],
    subcategory: 'shorts'
  },
  {
    id: '3',
    name: 'Conjunto Deportivo Niño',
    price: 6990,
    category: 'niños', 
    image: '/images/niños/conjunto.jpg',
    sizes: ['4', '6', '8', '10'],
    colors: ['Azul', 'Rojo'],
    subcategory: 'conjuntos'
  },
  {
    id: '4',
    name: 'Botella Deportiva 750ml',
    price: 2990,
    category: 'accesorios',
    image: '/images/accesorios/botella.jpg',
    subcategory: 'hidratacion'
  },
  // ... más productos
];

// Obtener productos por categoría
export const getProductsByCategory = (category: Product['category']) => {
  return allProducts.filter(product => product.category === category);
};

// Obtener productos destacados
export const getFeaturedProducts = (category: Product['category']) => {
  return allProducts.filter(product => 
    product.category === category && product.featured
  ).slice(0, 8);
};

// Función para convertir productos viejos al formato compatible
export const convertToCompatibleProducts = (products: Product[]): CompatibleProduct[] => {
  return products.map(product => ({
    id: product.id, // Mantener como está (string)
    name: product.name,
    price: product.price,
    images: [product.image], // Convertir image a images[]
    category: product.category,
    subcategory: product.subcategory || '',
    featured: product.featured,
    sizes: product.sizes,
    colors: product.colors
  }));
};