import { PrismaClient } from '@prisma/client';
import { camperaslivianasHombre } from '../src/modules/products/data/hombre/camperas-livianas';

const prisma = new PrismaClient();

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

async function insertProducts() {
  try {
    console.log('🚀 Insertando productos de camperas ligeras para hombre...');
    
    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const productData of camperaslivianasHombre) {
      try {
        // Verificar si el producto ya existe por newId
        const existingProduct = await prisma.product.findUnique({
          where: { newId: productData.newId }
        });
        
        if (existingProduct) {
          console.log(`⏭️  Saltando: ${productData.newId} - Ya existe`);
          skippedCount++;
          continue;
        }
        
        // Insertar nuevo producto
        const product = await prisma.product.create({
          data: {
            newId: productData.newId,
            name: productData.name,
            price: productData.price,
            originalPrice: productData.originalPrice,
            category: productData.category,
            subcategory: productData.subcategory,
            brand: productData.brand,
            description: productData.description,
            mainImage: productData.mainImage,
            images: productData.images,
            colorImages: productData.colorImages,
            specifications: productData.specifications,
            sizes: productData.sizes,
            colors: productData.colors,
            inStock: productData.inStock,
            stockQuantity: productData.stockQuantity,
            featured: productData.featured,
            discountPercentage: productData.discountPercentage,
            rating: productData.rating,
            reviewCount: productData.reviewCount,
            fit: productData.fit
          }
        });
        
        insertedCount++;
        console.log(`✅ ${product.newId} - ${product.name}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error insertando ${productData.newId}:`, getErrorMessage(error));
      }
    }
    
    console.log(`🎉 Inserción completada!`);
    console.log(`✅ ${insertedCount} productos insertados`);
    console.log(`⏭️  ${skippedCount} productos saltados (ya existían)`);
    console.log(`❌ ${errorCount} productos con errores`);
    console.log(`📊 Total procesados: ${camperaslivianasHombre.length}`);
    
  } catch (error) {
    console.error('❌ Error general en inserción:', getErrorMessage(error));
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la inserción con manejo de errores
insertProducts().catch(error => {
  console.error('❌ Error inesperado:', getErrorMessage(error));
  process.exit(1);
});