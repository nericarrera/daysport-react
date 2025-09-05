import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IdGeneratorService {
  async generateProductId(category: string): Promise<string> {
    const prefix = category.slice(0, 3).toUpperCase();
    const unique = Date.now().toString(36);
    return `${prefix}-${unique}`;
  }

  async migrateExistingProduct(oldId: number, category: string): Promise<string> {
    const prefix = category.slice(0, 3).toUpperCase();
    return `${prefix}-${oldId}`;
  }
}

const prisma = new PrismaClient();

async function testNewIdField() {
  try {
    // Verificar que el campo newId existe
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Product' AND column_name = 'newId'
    `;
    
    console.log('✅ Información del campo newId:', tableInfo);

    // Intentar insertar un producto con newId
    const testProduct = await prisma.product.create({
      data: {
        name: 'Producto Test',
        price: 99.99,
        category: 'hombre',
        images: ['test.jpg'],
        mainImage: 'test-main.jpg',
        stock: 10,
        sizes: ['M'],
        colors: ['azul'],
        newId: 'hombre-0001' // ← Probar el campo nuevo
      }
    });

    console.log('✅ Producto creado con newId:', testProduct);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewIdField();