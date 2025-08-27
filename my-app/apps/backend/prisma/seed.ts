import { PrismaClient } from '@prisma/client';
import { productosHombre } from '../src/modules/products/data/hombre';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  
  await prisma.product.deleteMany();
  console.log('🗑️ Deleted existing products');
  
  for (const productData of productosHombre) {
    await prisma.product.create({
      data: {
        // CAMPOS OBLIGATORIOS:
        name: productData.name,
        price: productData.price,
        category: productData.category,
        subcategory: productData.subcategory || '',
        description: productData.description || '',
        images: productData.images || [],
        mainImage: productData.mainImage || '',
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        inStock: productData.inStock ?? true,
        
        // CAMPOS OPCIONALES QUE SÍ EXISTEN EN TUS PRODUCTOS:
        originalPrice: productData.originalPrice || null,
        stockQuantity: productData.stockQuantity || 0,
        brand: productData.brand || '',
        featured: productData.featured || false,
        discountPercentage: productData.discountPercentage || 0,
        rating: productData.rating || 0,
        reviewCount: productData.reviewCount || 0,
        specifications: productData.specifications || {},
        colorImages: productData.colorImages || {},
        fit: productData.fit || '',
        
        // ⚠️ CAMPOS NUEVOS QUE NO EXISTEN EN TUS PRODUCTOS - COMENTAR TEMPORALMENTE:
        // detailImages: productData.detailImages || [], // ← COMENTAR
        // sizeGuide: productData.sizeGuide || null,     // ← COMENTAR  
        // measurements: productData.measurements || null, // ← COMENTAR
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