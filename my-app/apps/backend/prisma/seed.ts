import { PrismaClient } from '@prisma/client';
import { productosMujer } from '../src/products/data/mujeres';
import { productosHombre } from '../src/products/data/hombres';
import { productosNinos } from '../src/products/data/ninos';
import { productosAccesorios } from '../src/products/data/accesorios';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  
  // Limpiar base de datos existente
  await prisma.product.deleteMany();
  
  // Combinar todos los productos
  const allProducts = [
    ...productosMujer,
    ...productosHombre, 
    ...productosNinos,
    ...productosAccesorios
  ];
  
  // Crear productos
  for (const productData of allProducts) {
    await prisma.product.create({
      data: {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }
  
  console.log(`✅ Seed completed! Added ${allProducts.length} products.`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });