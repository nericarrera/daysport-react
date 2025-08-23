import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Zapatillas deportivas hombre",
    description: "Zapatillas cómodas para running y entrenamiento diario.",
    price: 35000,
    stock: 15,
    category: "hombre",
    subcategory: "calzado",   // ✅ agregado
    featured: true,
    images: [
      "/images/products/zapatilla-hombre-1.jpg",
      "/images/products/zapatilla-hombre-2.jpg",
    ],
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["negro", "blanco", "azul"],
  },
  {
    id: 2,
    name: "Camiseta mujer fitness",
    description: "Camiseta de secado rápido para entrenamiento.",
    price: 12000,
    stock: 25,
    category: "mujer",
    subcategory: "ropa",   // ✅ agregado
    featured: true,
    images: [
      "/images/products/camiseta-mujer-1.jpg",
      "/images/products/camiseta-mujer-2.jpg",
    ],
    sizes: ["S", "M", "L"],
    colors: ["rosa", "negro", "gris"],
  },
  {
    id: 3,
    name: "Mochila deportiva",
    description: "Mochila resistente con múltiples compartimentos.",
    price: 18000,
    stock: 10,
    category: "accesorios",
    subcategory: "bolsos",   // ✅ agregado
    featured: false,
    images: [
      "/images/products/mochila-1.jpg",
      "/images/products/mochila-2.jpg",
    ],
    sizes: [],
    colors: ["negro", "azul", "verde"],
  },
  {
    id: 4,
    name: "Zapatillas niño",
    description: "Zapatillas deportivas ligeras para niños.",
    price: 20000,
    stock: 8,
    category: "niños",
    subcategory: "calzado",   // ✅ agregado
    featured: true,
    images: [
      "/images/products/zapatilla-nino-1.jpg",
      "/images/products/zapatilla-nino-2.jpg",
    ],
    sizes: ["30", "31", "32", "33", "34"],
    colors: ["azul", "rojo", "blanco"],
  },
];