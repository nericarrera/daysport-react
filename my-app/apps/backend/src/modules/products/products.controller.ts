import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products') // Endpoint: http://localhost:3001/api/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
  ) {
    try {
      return this.productsService.getProducts(category, subcategory);
    } catch (error) {
      throw new BadRequestException('Error al obtener productos');
    }
  }
}