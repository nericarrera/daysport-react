import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service'; // ← services, no servicesS

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ Usa el método que SÍ existe: getProducts()
  @Get()
  async getProducts(@Query('category') category: string) {
    return this.productsService.getProducts(category);
  }

  // ✅ O si prefieres parámetro en la ruta:
  @Get('category/:category')
  async getByCategory(@Param('category') category: string) {
    return this.productsService.getProducts(category);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }
}