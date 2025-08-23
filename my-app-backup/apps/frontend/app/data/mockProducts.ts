
import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: 1,
    name: "Camiseta Básica Mujer",
    price: 29.99,
    category: "mujer",
    subcategory: "camisetas",
    images: ["https://picsum.photos/500/600?random=1"],
    description: "Camiseta de algodón 100% de alta calidad",
    sizes: ["S", "M", "L", "XL"],
    colors: ["blanco", "negro", "gris"],
    stock: 15,
    featured: true
  },
  {
    id: 2,
    name: "Jeans Hombre Clásico",
    price: 59.99,
    category: "hombre",
    subcategory: "pantalones",
    images: ["https://picsum.photos/500/600?random=2"],
    description: "Jeans de corte regular, cómodos y duraderos",
    sizes: ["32", "34", "36", "38"],
    colors: ["azul", "negro"],
    stock: 8,
    featured: true
  }
  // ... más productos
];