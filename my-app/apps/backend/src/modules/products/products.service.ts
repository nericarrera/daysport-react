import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(category?: string, subcategory?: string) {
    try {
      console.log('📦 Fetching products with filters:', { category, subcategory });

      const where: Prisma.ProductWhereInput = {};
      if (category) where.category = category;
      if (subcategory) where.subcategory = subcategory;

      const products: Product[] = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      const host = process.env.HOST_BACKEND || 'http://localhost:3001';
      const productsWithImages = products.map((p) => ({
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

  async getProductById(id: number) {
    try {
      const product: Product | null = await this.prisma.product.findUnique({ where: { id } });
      if (!product) throw new Error('Product not found');

      const host = process.env.HOST_BACKEND || 'http://localhost:3001';
      return { ...product, mainImageUrl: `${host}/assets/images/products/${product.mainImage}` };
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      throw new Error('Error fetching product');
    }
  }

  async getFeaturedProducts() {
    try {
      const products: Product[] = await this.prisma.product.findMany({
        where: { featured: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      const host = process.env.HOST_BACKEND || 'http://localhost:3001';
      const productsWithImages = products.map((p) => ({
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