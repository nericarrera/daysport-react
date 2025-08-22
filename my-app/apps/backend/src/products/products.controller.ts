import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getProducts(@Query('category') category?: string, @Query('featured') featured?: string) {
    const whereClause: any = {};
    
    if (category) whereClause.category = category;
    if (featured === 'true') whereClause.featured = true;

    const products = await this.prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return products;
  }
}