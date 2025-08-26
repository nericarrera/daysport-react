import { PrismaClient } from '@prisma/client';
import { productosHombre } from '../src/modules/products/data/hombre'; // ← Importa tus datos

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Eliminar productos existentes
  await prisma.product.deleteMany();
  console.log('🗑️ Deleted existing products');

  // Crear productos desde tus archivos
  for (const productData of productosHombre) {
    await prisma.product.create({
      data: {
        name: productData.name,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: productData.category,
        subcategory: productData.subcategory,
        brand: productData.brand,
        description: productData.description,
        images: productData.images,
        mainImage: productData.mainImage,
        sizes: productData.sizes,
        colors: productData.colors,
        inStock: productData.inStock,
        stockQuantity: productData.stockQuantity,
        featured: productData.featured,
        discountPercentage: productData.discountPercentage,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        // Agrega otros campos que tengas
      }
    });
  }

  console.log('✅ Products created:', productosHombre.length);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });