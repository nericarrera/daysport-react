import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Obtener productos por categoría / subcategoría
  async getProducts(category?: string, subcategory?: string) {
    try {
      console.log('📦 Fetching products with filters:', { category, subcategory });
      
      const where: any = {};
      if (category) where.category = category;
      if (subcategory) where.subcategory = subcategory;

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      // Agregar URL completa de la imagen
      const host = process.env.HOST_BACKEND || 'http://localhost:3001';
      const productsWithImages = products.map(p => ({
        ...p,
        mainImageUrl: `${host}/assets/images/products/${p.mainImage}`,
      }));

      console.log('✅ Products found:', productsWithImages.length);
      return { products: productsWithImages, total: productsWithImages.length };
      
    } catch (error) {
      console.error('❌ Error in getProducts:', error);
      throw new Error('Error fetching products');
    }
  }

  // Obtener producto por ID
  async getProductById(id: number) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) throw new Error('Product not found');

      const host = process.env.HOST_BACKEND || 'http://localhost:3001';
      return { ...product, mainImageUrl: `${host}/assets/images/products/${product.mainImage}` };
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      throw new Error('Error fetching product');
    }
  }

  // Obtener productos destacados
  async getFeaturedProducts() {
    try {
      const products = await this.prisma.product.findMany({
        where: { featured: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      const host = process.env.HOST_BACKEND || 'http://localhost:3001';
      const productsWithImages = products.map(p => ({
        ...p,
        mainImageUrl: `${host}/assets/images/products/${p.mainImage}`,
      }));

      return { products: productsWithImages, total: productsWithImages.length };
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      throw new Error('Error fetching featured products');
    }
  }
}