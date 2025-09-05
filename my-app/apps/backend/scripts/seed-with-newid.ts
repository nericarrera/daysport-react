import { PrismaClient } from '@prisma/client';
import { IdGeneratorService } from '../src/common/services/id-generator.service';

const prisma = new PrismaClient();
const idGenerator = new IdGeneratorService();

async function seedProductsWithNewId() {
  try {
    console.log('🚀 Iniciando migración de newIds para productos existentes...');
    
    // 1. Obtener todos los productos existentes
    const products = await prisma.product.findMany();
    console.log(`📦 Encontrados ${products.length} productos para migrar`);
    
    let migratedCount = 0;
    
    // 2. Generar newId para cada producto
    for (const product of products) {
      try {
        const newId = await idGenerator.generateProductId(product.category);
        
        // 3. Actualizar el producto con newId
        await prisma.product.update({
          where: { id: product.id },
          data: { newId }
        });
        
        migratedCount++;
        console.log(`✅ ${product.id} -> ${newId}`);
        
      } catch (error) {
        console.error(`❌ Error migrando producto ${product.id}:`, error.message);
      }
    }
    
    console.log(`🎉 Migración completada! ${migratedCount}/${products.length} productos migrados`);
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
seedProductsWithNewId();