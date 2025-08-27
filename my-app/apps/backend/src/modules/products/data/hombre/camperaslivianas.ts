export const camperaslivianasHombre = [
  {
    name: "Campera Liviana Deportiva Hombre",
    price: 35.00,
    originalPrice: 40.00,
    category: "hombre",
    subcategory: "camperaslivianas",
    brand: "Original",
    description: "Campera liviana deportiva para hombre, ideal para actividades al aire libre y uso casual. Resistente al viento y al agua.",
    
    // Imágenes principales (vista previa)
    images: [
      "/images/hombre/camperaslivianas/campera-liviana-combinada-abc-1.jpeg", // Azul - frontal
      "/images/hombre/camperaslivianas/campera-liviana-combinada-azulvioleta-1.jpeg"  // Azul - lateral
    ],
    mainImage: "/images/hombre/camperaslivianas/campera-liviana-combinada-abc-1.jpeg",

    // Imágenes detalladas por color (6-8 fotos por color)
    colorImages: {
      "azul": [
        "/images/hombre/camperaslivianas/campera-liviana-combinada-azulvioleta-1.jpeg", // Azul - frontal
      ],
      "gris": [
        "/images/hombre/camperaslivianas/campera-liviana-combinada-gtbg-1.jpeg",
      ],
      "negro": [
       "/images/hombre/camperaslivianas/campera-liviana-combinada-nbg-1.jpeg",
      ]
    },

    // Especificaciones técnicas
    specifications: {
      "Material": "100% Poliéster",
      "Tecnología": "Dry-Fit, Anti-humedad",
      "Lavado": "Lavable a máquina",
      "Edad Recomendada": "Adultos",
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
  {
    name: "Campera Liviana Deportiva clasica Hombre",
    price: 35.99,
    originalPrice: 45.00,
    category: "hombre",
    subcategory: "camperaslivianas",
    brand: "Original",
    description: "Campera liviana deportiva clasica para hombre, ideal para actividades al aire libre y uso casual. Resistente al viento y al agua.",
    
    images: [
      "/images/hombre/camperaslivianas/campera-liviana-lisa-cnegro-1.jpeg", // Negro - frontal
      "/images/hombre/camperaslivianas/campera-liviana-lisa-cnegro-1.jpeg"  // Negro - detalle
    ],
    mainImage: "/images/hombre/camperaslivianas/campera-liviana-lisa-cnegro-1.jpeg",

    colorImages: {
      "gris": [
        "/images/hombre/camperaslivianas/campera-liviana-lisa-cnegro-1.jpeg",
       
      ],
      "negro": [
        "/images/hombre/camperaslivianas/campera-liviana-lisa-negro-1.jpeg",
        
      ],
    },

    specifications: {
      "Material": "Algodón 90%, Elastano 10%",
      "Cuidado": "Lavable a máquina, No usar secadora",
      "Cuello": "Redondo",
      "Manga": "Corta",
      "Estampado": "Serigrafía de alta calidad"
    },

    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["negro", "gris"],
    inStock: true,
    stockQuantity: 20,
    featured: false,
    discountPercentage: 21,
    rating: 4.2,
    reviewCount: 45,
    fit: "ajustado"
  }

  // Puedes agregar 8-10 productos más siguiendo la misma estructura...
];