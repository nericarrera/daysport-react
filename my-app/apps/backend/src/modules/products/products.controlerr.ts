import { Controller, Get, Param } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get(':category')
  async getByCategory(@Param('category') category: string) {
    // Lógica para obtener productos por categoría
  }
}