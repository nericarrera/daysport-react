import { PrismaClient } from '@prisma/client';
import { productosHombre } from '../src/modules/products/data/hombre'; // ← Asegurate que esta ruta sea correcta

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  
  // Eliminar productos existentes
  await prisma.product.deleteMany();
  console.log('🗑️ Deleted existing products');
  
  // Crear NUEVOS productos de hombre
  for (const productData of productosHombre) {
    await prisma.product.create({
      data: {
        name: productData.name,
        price: productData.price,
        category: productData.category,
        subcategory: productData.subcategory,
        description: productData.description,
        images: productData.images,
        sizes: productData.sizes,
        colors: productData.colors,
        inStock: productData.inStock,
        featured: productData.featured || false,
        // Agrega todos los campos que tengas
      }
    });
  }
  
  console.log(`✅ Created ${productosHombre.length} products for hombre`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });