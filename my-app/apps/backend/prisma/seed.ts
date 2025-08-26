// prisma/seed.ts - VERSIÓN CORREGIDA Y COMPLETA
import { PrismaClient } from '@prisma/client';
import { productosMujer } from '../src/modules/products/data/mujeres';
import { productosHombre } from '../src/modules/products/data/hombres';
import { productosNinos } from '../src/modules/products/data/ninos';
import { productosAccesorios } from '../src/modules/products/data/accesorios';

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
  
  console.log(`📦 Total products to seed: ${allProducts.length}`);
  
  // Crear productos
  for (const [index, productData] of allProducts.entries()) {
  try {
    
    const product = productData as any;
    
    const productWithDefaults = {
      ...productData,
      mainImage: product.mainImage || product.images[0] || '/placeholder.jpg',
      detailImages: product.detailImages || [], // ← Usar product en lugar de productData
      colorImages: product.colorImages || {},
      specifications: product.specifications || {},
      fit: product.fit || 'regular',
      stockQuantity: product.stockQuantity || product.stock || 0,
      inStock: product.inStock ?? (product.stockQuantity > 0 || product.stock > 0)
    };

    await prisma.product.create({
      data: productWithDefaults
    });

  } catch (error) {
    console.error(`❌ Error adding product ${productData.name}:`, error);
  }
}
  
  console.log(`🎉 Seed completed! Added ${allProducts.length} products.`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });