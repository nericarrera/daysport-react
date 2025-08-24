import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Todos los productos con filtros
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

  // Producto por ID
  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id }
      // Si tienes reviews: include: { reviews: true }
    });
  }

  // Productos nuevos (últimos 30 días)
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