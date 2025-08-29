'use client';

export const categories = [

  {
    name: "MUJER",
    href: "/mujer",
    slug: "mujer", // ← AGREGAR
    subcategories: [
      { name: "Remeras", href: "/mujer?subcategory=remeras", slug: "remeras", image: "/menu-seccion-img/mujer/menu-remeras.jpg" },
      { name: "Buzos", href: "/mujer?subcategory=buzos", image: "/menu-seccion-img/mujer/menu-buzos.jpg" },
      { name: "Pantalones", href: "/mujer?subcategory=pantalones", image: "/menu-seccion-img/mujer/menu-pantalones.webp" },
      { name: "Camperas", href: "/mujer?subcategory=camperas", image: "/menu-seccion-img/mujer/menu-camperas.jpg" },
      { name: "Calzas", href: "/mujer?subcategory=calzas", image: "/menu-seccion-img/mujer/menu-calzas.jpg" },
      { name: "Shorts", href: "/mujer?subcategory=shorts", image: "/menu-seccion-img/mujer/menu-shorts.webp" },
      { name: "Zapatillas", href: "/mujer?subcategory=zapatillas", image: "/menu-seccion-img/mujer/menu-zapatillas.jpg" },
      { name: "Conjuntos", href: "/mujer?subcategory=conjuntos", image: "/menu-seccion-img/mujer/menu-conjuntos.jpg" },
    ]
  },

  {
    name: "HOMBRE",
    href: "/hombre",
    slug: "hombre",
    subcategories: [
      { name: "Remeras", href: "/hombre?subcategory=remeras", image: "/menu-seccion-img/hombre/menu-remeras.jpg" },
      { name: "Buzos", href: "/hombre?subcategory=buzos", image: "/menu-seccion-img/hombre/menu-buzos.jpg" },
      { name: "Pantalones", href: "/hombre?subcategory=pantalones", image: "/menu-seccion-img/hombre/menu-pantalones.jpg" },
      { name: "Camperas", href: "/hombre?subcategory=camperas", image: "/menu-seccion-img/hombre/menu-camperas.jpg" },
      { name: "Shorts", href: "/hombre?subcategory=shorts", image: "/menu-seccion-img/hombre/menu-shorts.jpg" },
      { name: "Deportes", href: "/hombre?subcategory=deportes", image: "/menu-seccion-img/hombre/menu-deportes.jpg" },
      { name: "Conjuntos", href: "/hombre?subcategory=conjuntos", image: "/menu-seccion-img/hombre/menu-conjuntos.jpg" },
    ]
  },
    {
        name: "NIÑOS",
        href: "/ninos",
        slug: "ninos",
        subcategories: [
        { name: "Remeras", href: "/ninos?subcategory=remeras", image: "/menu-seccion-img/niños/menu-remeras.jpg" },
        { name: "Buzos", href: "/ninos?subcategory=buzos", image: "/menu-seccion-img/niños/menu-buzos.jpg" },
        { name: "Pantalones", href: "/ninos?subcategory=pantalones", image: "/menu-seccion-img/niños/menu-pantalones.jpg" },
        { name: "Camperas", href: "/ninos?subcategory=camperas", image: "/menu-seccion-img/niños/menu-camperas.jpg" },
        { name: "Shorts", href: "/ninos?subcategory=shorts", image: "/menu-seccion-img/niños/menu-shorts.jpg" },
        { name: "Conjuntos", href: "/ninos?subcategory=conjuntos", image: "/menu-seccion-img/niños/menu-conjuntos.jpg" },
        { name: "Zapatillas", href: "/ninos?subcategory=zapatillas", image: "/menu-seccion-img/niños/menu-zapatillas.jpg" },
        ]
    },
    {
         name: "ACCESORIOS", 
      href: "/accesorios", 
      subcategories: [
        { name: "Botellas", href: "/accesorios?subcategory=botellas", image: "/menu-seccion-img/accesorios/menu-botellas.jpg" },
        { name: "Bolsos", href: "/accesorios?subcategory=bolsos", image: "/menu-seccion-img/accesorios/menu-bolsos.jpeg" },
        { name: "Calzado", href: "/accesorios?subcategory=calzado", image: "/menu-seccion-img/accesorios/menu-zapatillas.jpg" },
        { name: "Gorras", href: "/accesorios?subcategory=gorras", image: "/menu-seccion-img/accesorios/menu-gorras.jpg" },
        { name: "Medias", href: "/accesorios?subcategory=medias", image: "/menu-seccion-img/accesorios/menu-medias.jpg" },
        { name: "Mochilas", href: "/accesorios?subcategory=mochilas", image: "/menu-seccion-img/accesorios/menu-mochilas.jpg" },
        { name: "Lentes", href: "/accesorios?subcategory=lentes", image: "/menu-seccion-img/accesorios/menu-lentes.jpg" },
        
      ]
    },
];