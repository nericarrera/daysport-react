import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testNewIdField() {
  try {
    console.log('🧪 Probando campo newId...');
    
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
        newId: 'HOM-' + Date.now().toString(36).toUpperCase()
      }
    });

    console.log('✅ Producto creado con newId:', testProduct);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testNewIdField();