export const CATEGORIES = {
  mujer: {
    name: "Mujer",
    subcategories: [
      { slug: "remeras", name: "Remeras" },
      { slug: "pantalones", name: "Pantalones" },
      { slug: "shorts", name: "Shorts" },
      { slug: "joggins", name: "Joggins" },
      { slug: "buzos", name: "Buzos" },
      { slug: "zapatillas", name: "Zapatillas" },
      { slug: "conjuntos", name: "Conjuntos" }
    ]
  },
  hombre: {
    name: "Hombre", 
    subcategories: [
      { slug: "remeras", name: "Remeras" },
      { slug: "pantalones", name: "Pantalones" },
      { slug: "shorts", name: "Shorts" },
      { slug: "joggins", name: "Joggins" },
      { slug: "buzos", name: "Buzos" },
      { slug: "zapatillas", name: "Zapatillas" }
    ]
  },
    niños: {
        name: "Niños",
        subcategories: [
        { slug: "remeras", name: "Remeras" },
        { slug: "pantalones", name: "Pantalones" },
        { slug: "shorts", name: "Shorts" },
        { slug: "joggins", name: "Joggins" },
        { slug: "buzos", name: "Buzos" },
        { slug: "zapatillas", name: "Zapatillas" }
        ]
    },
    accesorios: {
        name: "Accesorios",
        subcategories: [
        { slug: "mochilas", name: "Mochilas" },
        { slug: "gorras", name: "Gorras" },
        { slug: "calcetines", name: "Calcetines" },
        { slug: "riñoneras", name: "Riñoneras" }
        ]
    },
  
} as const;