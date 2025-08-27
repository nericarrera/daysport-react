import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ✅ MÉTODO QUE FALTA - para el controller
  async getProducts(category?: string, subcategory?: string) {
    try {
      console.log('📦 Fetching products with filters:', { category, subcategory });
      
      const where: any = {};
      
      if (category) {
        where.category = category;
      }
      
      if (subcategory) {
        where.subcategory = subcategory;
      }

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      console.log('✅ Products found:', products.length);
      return { products, total: products.length };
      
    } catch (error) {
      console.error('❌ Error in getProducts:', error);
      throw new Error('Error fetching products');
    }
  }

  // ✅ MÉTODO PARA PRODUCTO POR ID (si lo necesitas)
  async getProductById(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Error fetching product');
    }
  }

  // ✅ MÉTODO PARA PRODUCTOS DESTACADOS (opcional)
  async getFeaturedProducts() {
    try {
      const products = await this.prisma.product.findMany({
        where: { featured: true },
        take: 10,
        orderBy: { createdAt: 'desc' }
      });

      return { products, total: products.length };
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw new Error('Error fetching featured products');
    }
  }
}