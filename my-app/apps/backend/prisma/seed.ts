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
        // CAMPOS OBLIGATORIOS DEL SCHEMA:
        name: productData.name,
        price: productData.price,
        category: productData.category,
        subcategory: productData.subcategory || '', // ← OBLIGATORIO en schema
        description: productData.description || '', // ← OBLIGATORIO en schema
        images: productData.images || [],           // ← OBLIGATORIO (String[])
        mainImage: productData.mainImage || '',     // ← OBLIGATORIO
        sizes: productData.sizes || [],             // ← OBLIGATORIO (String[])
        colors: productData.colors || [],           // ← OBLIGATORIO (String[])
        inStock: productData.inStock ?? true,       // ← OBLIGATORIO
        
        // CAMPOS OPCIONALES CON VALORES POR DEFECTO:
        originalPrice: productData.originalPrice || null,
        stockQuantity: productData.stockQuantity || 0,
        brand: productData.brand || '',
        featured: productData.featured || false,
        discountPercentage: productData.discountPercentage || 0,
        rating: productData.rating || 0,
        reviewCount: productData.reviewCount || 0,
        
        // CAMPOS NUEVOS DEL SCHEMA:
        specifications: productData.specifications || {},
        colorImages: productData.colorImages || {},
        detailImages: productData.detailImages || [], // ← OBLIGATORIO (String[])
        sizeGuide: productData.sizeGuide || null,
        measurements: productData.measurements || null,
        fit: productData.fit || '',
        
        // Campos automáticos de Prisma (no necesitan valor):
        // createdAt: auto, updatedAt: auto, id: auto
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