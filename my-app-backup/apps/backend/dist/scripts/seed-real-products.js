"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const realProducts = [
    // ==================== MUJER ====================
    {
        name: 'Remera Deportiva Mujer Dry-Fit',
        price: 3990,
        category: 'mujer',
        subcategory: 'remeras',
        images: ['/images/mujer/remeras/remera-dryfit-negro.jpg'],
        description: 'Remera técnica de secado rápido, ideal para entrenamiento intenso',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Negro', 'Azul Marino', 'Blanco'],
        stock: 15,
        featured: true
    },
    {
        name: 'Short Deportivo Mujer Compression',
        price: 3490,
        category: 'mujer',
        subcategory: 'shorts',
        images: ['/images/mujer/shorts/short-compression-negro.jpg'],
        description: 'Short de compresión para mayor rendimiento',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Negro', 'Gris', 'Azul'],
        stock: 12,
        featured: true
    },
    {
        name: 'Buzo Deportivo Mujer Hoodie',
        price: 5990,
        category: 'mujer',
        subcategory: 'buzos',
        images: ['/images/mujer/buzos/buzo-hoodie-gris.jpg'],
        description: 'Buzo con capucha para entrenamiento al aire libre',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Gris', 'Negro', 'Rosado'],
        stock: 8,
        featured: false
    },
    {
        name: 'Calza Deportiva Mujer High-Waist',
        price: 4590,
        category: 'mujer',
        subcategory: 'calzas',
        images: ['/images/mujer/calzas/calza-highwaist-negro.jpg'],
        description: 'Calza alta con tecnología transpirable',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Negro', 'Gris', 'Verde'],
        stock: 10,
        featured: true
    },
    // ==================== HOMBRE ====================
    {
        name: 'Remera Deportiva Hombre Performance',
        price: 3790,
        category: 'hombre',
        subcategory: 'remeras',
        images: ['/images/hombre/remeras/remera-performance-negra.jpg'],
        description: 'Remera técnica para entrenamiento de alto impacto',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Negro', 'Blanco', 'Rojo'],
        stock: 18,
        featured: true
    },
    {
        name: 'Pantalón Deportivo Hombre Jogger',
        price: 4990,
        category: 'hombre',
        subcategory: 'pantalones',
        images: ['/images/hombre/pantalones/pantalon-jogger-gris.jpg'],
        description: 'Pantalón jogger cómodo para ejercicio y casual',
        sizes: ['M', 'L', 'XL'],
        colors: ['Gris', 'Negro', 'Azul'],
        stock: 14,
        featured: true
    },
    {
        name: 'Campera Deportiva Hombre Impermeable',
        price: 7990,
        category: 'hombre',
        subcategory: 'camperas',
        images: ['/images/hombre/camperas/campera-impermeable-azul.jpg'],
        description: 'Campera impermeable para actividades outdoor',
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Azul', 'Negro', 'Verde'],
        stock: 6,
        featured: false
    },
    // ==================== NIÑOS ====================
    {
        name: 'Conjunto Deportivo Niño Star',
        price: 4290,
        category: 'ninos',
        subcategory: 'conjuntos',
        images: ['/images/ninos/conjuntos/conjunto-star-azul.jpg'],
        description: 'Conjunto divertido para niños activos',
        sizes: ['4', '6', '8', '10'],
        colors: ['Azul', 'Rojo', 'Verde'],
        stock: 20,
        featured: true
    },
    {
        name: 'Remera Infantil Dinosaurio',
        price: 2290,
        category: 'ninos',
        subcategory: 'remeras',
        images: ['/images/ninos/remeras/remera-dinosaurio-verde.jpg'],
        description: 'Remera divertida con estampado de dinosaurio',
        sizes: ['4', '6', '8', '10'],
        colors: ['Verde', 'Azul', 'Rojo'],
        stock: 25,
        featured: false
    },
    // ==================== ACCESORIOS ====================
    {
        name: 'Botella Deportiva 1L Tritan',
        price: 2490,
        category: 'accesorios',
        subcategory: 'hidratacion',
        images: ['/images/accesorios/hidratacion/botella-tritan-azul.jpg'],
        description: 'Botella libre de BPA, ideal para deportistas',
        sizes: ['Único'],
        colors: ['Azul', 'Verde', 'Negro'],
        stock: 30,
        featured: true
    },
    {
        name: 'Gorra Deportiva Adjustable',
        price: 1890,
        category: 'accesorios',
        subcategory: 'gorras',
        images: ['/images/accesorios/gorras/gorra-adjustable-negra.jpg'],
        description: 'Gorra ajustable con protección UV',
        sizes: ['Único'],
        colors: ['Negro', 'Blanco', 'Gris'],
        stock: 40,
        featured: true
    },
    {
        name: 'Mochila Deportiva 20L',
        price: 6990,
        category: 'accesorios',
        subcategory: 'mochilas',
        images: ['/images/accesorios/mochilas/mochila-20l-negra.jpg'],
        description: 'Mochila espaciosa con compartimento para laptop',
        sizes: ['Único'],
        colors: ['Negro', 'Azul', 'Rojo'],
        stock: 12,
        featured: true
    }
];
async function main() {
    console.log('🌱 Iniciando carga de productos reales...');
    // Limpiar productos existentes
    await prisma.product.deleteMany({});
    console.log('🧹 Productos antiguos eliminados');
    // Crear nuevos productos
    for (const product of realProducts) {
        await prisma.product.create({
            data: product
        });
        console.log(`✅ Producto creado: ${product.name}`);
    }
    console.log('🎉 ¡Todos los productos fueron cargados!');
    console.log('📊 Total:', realProducts.length, 'productos');
}
main()
    .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
