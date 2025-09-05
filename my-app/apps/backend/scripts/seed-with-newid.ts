import { PrismaClient } from '@prisma/client';
import { IdGeneratorService } from '../src/common/services/id-generator.service';

const prisma = new PrismaClient();
const idGenerator = new IdGeneratorService();

// ✅ Función para manejar errores de forma segura
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'Error desconocido';
  }
}

async function seedProductsWithNewId() {
  try {
    console.log('🚀 Iniciando migración de newIds para productos existentes...');
    
    const products = await prisma.product.findMany();
    console.log(`📦 Encontrados ${products.length} productos para migrar`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        const newId = await idGenerator.generateProductId(product.category);
        
        await prisma.product.update({
          where: { id: product.id },
          data: { newId }
        });
        
        migratedCount++;
        console.log(`✅ ${product.id} -> ${newId}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrando producto ${product.id}:`, getErrorMessage(error));
      }
    }
    
    console.log(`🎉 Migración completada!`);
    console.log(`✅ ${migratedCount} productos migrados exitosamente`);
    console.log(`❌ ${errorCount} productos con errores`);
    console.log(`📊 Total procesados: ${products.length}`);
    
  } catch (error) {
    console.error('❌ Error general en migración:', getErrorMessage(error));
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
seedProductsWithNewId().catch(error => {
  console.error('❌ Error inesperado:', getErrorMessage(error));
  process.exit(1);
});