export const shortsHombre = [
  {
    newId: "hombre-shorts-0001",
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
    hoverImage: "/images/hombre/pantalones/pantalon-gabardina-recto-chocolate-2.jpeg",

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
  {
    newId: "hombre-shorts-0002",
    name: "Polo Deportivo Infantil Active Fit",
    price: 25.99,
    originalPrice: 32.99,
    category: "hombre",
    subcategory: "remeras",
    brand: "Nike",
    description: "Polo deportivo para niños con corte moderno y tejido transpirable. Perfecto para escuela y deportes.",
    
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", // Negro - frontal
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"  // Negro - detalle
    ],
    mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    hoverImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",

    colorImages: {
      "negro": [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=800",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
        "https://images.unsplash.com/photo-1506629905877-52a5ca6d63b1?w=800"
      ],
      "blanco": [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
        "https://images.unsplash.com/photo-1576566580491-39ae920c5f19?w=800",
        "https://images.unsplash.com/photo-1576566580491-39ae920c5f20?w=800",
        "https://images.unsplash.com/photo-1576566580491-39ae920c5f21?w=800",
        "https://images.unsplash.com/photo-1576566580491-39ae920c5f22?w=800",
        "https://images.unsplash.com/photo-1576566580491-39ae920c5f23?w=800"
      ],
      "gris": [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3106?w=800",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3107?w=800",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3108?w=800",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3109?w=800",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3110?w=800"
      ]
    },

    specifications: {
      "Material": "Algodón 90%, Elastano 10%",
      "Cuidado": "Lavable a máquina, No usar secadora",
      "Cuello": "Redondo",
      "Manga": "Corta",
      "Estampado": "Serigrafía de alta calidad"
    },

    sizes: ["6-8", "8-10", "10-12", "12-14"],
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