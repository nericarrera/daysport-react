export const conjuntosHombre = [
  {
    name: "Conjuto Combinado Campera Deportiva y Pantalon",
    price: 55.00,
    originalPrice: 40.00,
    category: "hombre",
    subcategory: "conjuntos",
    brand: "Original",
    description: "Conjunto deportivo para hombre que incluye campera liviana y pantalon deportivo. Ideal para actividades al aire libre y uso casual.",
    
    // Imágenes principales (vista previa)
    images: [
      "/assets/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verdeoliva-1.jpeg", // Azul - frontal
      "/assets/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verdeoliva-1.jpeg"  // Azul - lateral
    ],
    mainImage: "/assets/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verdeoliva-1.jpeg",

    // Imágenes detalladas por color (6-8 fotos por color)
    colorImages: {
      "verde": [
        "/assets/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verdeoliva-1.jpeg", // Azul - frontal
        "/assets/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verdeoliva-1.jpeg", // Azul - lateral  // Azul - niño usando
      ],
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
    colors: ["verde"],
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
    name: "Conjunto Deportivo Verano Remera y Short",
    price: 45.00,
    originalPrice: 50.99,
    category: "hombre",
    subcategory: "conjuntos",
    brand: "Original",
    description: "Conjunto deportivo de verano para hombre que incluye remera de manga corta y short. Perfecto para entrenamientos y actividades al aire libre.",
    
    images: [
      "/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verano-blanco-1.jpeg", // Negro - frontal
      "/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verano-blanco-1.jpeg"  // Negro - detalle
    ],
    mainImage: "/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verano-blanco-1.jpeg",

    colorImages: {
      "negro": [
        "/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verano-negro-1.jpeg",
      ],
      "blanco": [
        "/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verano-blanco-1.jpeg",
      ],
      "gris": [
        "/images/hombre/conjuntos/conjunto-deportivo-liviano-combinado-verano-gris-1.jpeg",
       
      ]
    },

    specifications: {
      "Material": "Algodón 90%, Elastano 10%",
      "Cuidado": "Lavable a máquina, No usar secadora",
      "Cuello": "Redondo",
      "Manga": "Corta",
      "Estampado": "Serigrafía de alta calidad"
    },

    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["negro", "blanco", "gris"],
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