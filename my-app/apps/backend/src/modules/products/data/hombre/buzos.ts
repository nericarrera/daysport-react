export const buzosHombre = [
  {
    name: "Buzos de Algodón con Capucha",
    price: 35.00,
    originalPrice: 40.00,
    category: "hombre",
    subcategory: "buzos",
    brand: "Original",
    description: "Buzo clasico de hombre, con capucha. Ideal para uso casual.",
    
    // Imágenes principales (vista previa)
    images: [
      "/images/hombre/buzos/buzos-algodon-frizado-concapucha-1.jpeg", // Azul - frontal
      "/images/hombre/buzos/buzos-algodon-frizado-concapucha-2.jpeg"  // Azul - lateral
    ],
    mainImage: "/images/hombre/buzos/buzos-algodon-frizado-concapucha-1.jpeg",

    // Imágenes detalladas por color (6-8 fotos por color)
    colorImages: {
      "marron": [
        "/images/hombre/pantalones/pantalon-gabardina-recto-chocolate-1.jpeg", // Azul - frontal
        "/images/hombre/pantalones/pantalon-gabardina-recto-chocolate-2.jpeg", // Azul - lateral  // Azul - niño usando
      ],
      "rojo": [
        "/images/hombre/buzos/buzos-algodon-frizado-concapucha-1.jpeg",
        
      ],
      "verde": [
        "/images/hombre/buzos/buzos-algodon-frizado-concapucha-3.jpeg",
       
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

    sizes: ["S", "M", "L", "XL", "XXL"],
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