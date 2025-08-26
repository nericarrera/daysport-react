import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ✅ Para tu necesidad actual (getProductsByCategory)
  async getProducts(category?: string) {
    try {
      console.log('📦 Fetching products for category:', category);
      
      const products = await this.prisma.product.findMany({
        where: category ? { category } : {},
      });
      
      console.log('✅ Products found:', products.length);
      return { products, total: products.length };
      
    } catch (error) {
      console.error('❌ Database error:', error);
      throw new Error('Error fetching products');
    }
  }

  // ✅ Para tu necesidad actual (getProductById)  
  async getProductById(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    } catch (error) {
      console.error('❌ Database error:', error);
      throw new Error('Error fetching product');
    }
  }

  // ✅ Funciones adicionales para el futuro (OPCIONAL)
  async findAll(filters: {
    category?: string;
    subcategory?: string;
    featured?: boolean;
    inStock?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { category, subcategory, featured, inStock, page = 1, limit = 10 } = filters;
    
    const where: any = {};
    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (featured !== undefined) where.featured = featured;
    if (inStock !== undefined) where.inStock = inStock;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.product.count({ where })
    ]);

    return {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalProducts: total
    };
  }

  async findNewProducts(limit: number = 10) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.prisma.product.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }
}