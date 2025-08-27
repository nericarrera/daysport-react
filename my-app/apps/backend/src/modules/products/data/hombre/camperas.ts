export const productosHombre = [
  {
    name: "Pantalon Corte Chino, Recto",
    price: 36.00,
    originalPrice: 40.00,
    category: "hombre",
    subcategory: "pantalones",
    brand: "Original",
    description: "Pantalon clasico de hombre, corte chino, recto, con bolsillos laterales y traseros. Ideal para uso casual y oficina.",
    
    // Imágenes principales (vista previa)
    images: [
      "/images/hombre/pantalones/pantalon-gabardina-recto-chocolate-1.jpeg", // Azul - frontal
      "/images/hombre/pantalones/pantalon-gabardina-recto-chocolate-2.jpeg"  // Azul - lateral
    ],
    mainImage: "/images/hombre/pantalones/pantalon-gabardina-recto-chocolate-1.jpeg",

    detailImages: [],

    // Imágenes detalladas por color (6-8 fotos por color)
    colorImages: {
      "marron": [
        "/images/hombre/pantalones/pantalon-gabardina-recto-chocolate-1.jpeg", // Azul - frontal
        "/images/hombre/pantalones/pantalon-gabardina-recto-chocolate-2.jpeg", // Azul - lateral  // Azul - niño usando
      ],
      "rojo": [
        
      ],
      "verde": [
       
      ]
    },

    // Especificaciones técnicas
    specifications: {
      "Material": "100% Poliéster",
      "Tecnología": "Dry-Fit, Anti-humedad",
      "Lavado": "Lavable a máquina",
      "Edad Recomendada": "4-12 años",
      "Características": "Costuras reforzadas, Elasticidad mejorada"
    },

    sizes: ["4-6", "6-8", "8-10", "10-12"],
    colors: ["azul", "rojo", "verde"],
    inStock: true,
    stockQuantity: 15,
    featured: true,
    discountPercentage: 22,
    rating: 4.4,
    reviewCount: 67,
    fit: "regular"
  },

  // SEGUNDO PRODUCTO 
  // Puedes agregar 8-10 productos más siguiendo la misma estructura...
];