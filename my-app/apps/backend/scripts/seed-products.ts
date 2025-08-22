import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  // PRODUCTOS MUJER
  {
    name: 'Remera Deportiva Mujer Fit',
    price: 2990,
    category: 'mujer',
    subcategory: 'remeras',
    images: ['/images/mujer/remera-fit.jpg'],
    description: 'Remera deportiva de alta calidad para entrenamiento',
    sizes: ['S', 'M', 'L'],
    colors: ['Negro', 'Blanco', 'Azul'],
    stock: 15,
    featured: true
  },
  {
    name: 'Short Deportivo Mujer',
    price: 2490,
    category: 'mujer',
    subcategory: 'shorts',
    images: ['/images/mujer/short-deportivo.jpg'],
    description: 'Short cómodo para actividades deportivas',
    sizes: ['XS', 'S', 'M'],
    colors: ['Negro', 'Gris'],
    stock: 20,
    featured: false
  },

  // PRODUCTOS HOMBRE
  {
    name: 'Remera Deportiva Hombre',
    price: 2790,
    category: 'hombre',
    subcategory: 'remeras',
    images: ['/images/hombre/remera-deportiva.jpg'],
    description: 'Remera deportiva para hombre de alta calidad',
    sizes: ['M', 'L', 'XL'],
    colors: ['Negro', 'Blanco', 'Rojo'],
    stock: 18,
    featured: true
  },
  {
    name: 'Pantalón Deportivo Hombre',
    price: 3990,
    category: 'hombre',
    subcategory: 'pantalones',
    images: ['/images/hombre/pantalon-deportivo.jpg'],
    description: 'Pantalón cómodo para entrenamiento',
    sizes: ['M', 'L', 'XL'],
    colors: ['Negro', 'Gris'],
    stock: 12,
    featured: true
  }
];

async function main() {
  console.log('🌱 Iniciando seed de productos...');

  for (const productData of sampleProducts) {
    // Verificar si el producto ya existe
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: productData.name,
        category: productData.category
      }
    });

    if (!existingProduct) {
      const product = await prisma.product.create({
        data: productData
      });
      console.log(`✅ Producto creado: ${product.name} (${product.category})`);
    } else {
      console.log(`⚠️ Producto ya existe: ${productData.name}`);
    }
  }

  console.log('🎉 Seed de productos completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });