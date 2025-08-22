import { Controller, Get, Query, Param } from '@nestjs/common'; // ← Agregar Param aquí
import { PrismaService } from '../../prisma/prisma.service';

@Controller() // ← Controlador en la raíz
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Get('products') // ← Endpoint: /products
  async getProducts(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('featured') featured?: string
  ) {
    const where: any = {};
    
    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (featured === 'true') where.featured = true;

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return products;
  }

  @Get('products/:id') // ← Endpoint: /products/1
  async getProductById(@Param('id') id: string) {
    return this.prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
  }
}