export const productosMujer = [
  {
    name: "Top Deportivo Energy Fit",
    price: 39.99,
    originalPrice: 49.99,
    category: "mujer",
    subcategory: "tops",
    brand: "Nike",
    description: "Top deportivo de alta compresión con tecnología Dri-FIT...",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
      "https://images.unsplash.com/photo-1506629905877-52a5ca6d63b1?w=500"
    ],
    mainImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500", // ← OBLIGATORIO
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["negro", "azul marino", "rosa", "verde menta"],
    inStock: true,
    stockQuantity: 25,
    featured: true,
    discountPercentage: 20,
    rating: 4.5,
    reviewCount: 128,
    specifications: {
      "Material": "88% Poliéster, 12% Elastano",
      "Cuidado": "Lavable a máquina"
    }
  },
  // ... otros productos con mainImage
];