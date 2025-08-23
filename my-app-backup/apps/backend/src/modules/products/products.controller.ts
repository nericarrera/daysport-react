import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('category/:category')
  async getByCategory(@Param('category') category: string) {
    return this.productsService.getByCategory(category);
  }
}