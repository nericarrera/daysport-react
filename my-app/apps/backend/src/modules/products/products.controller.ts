import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products') // ← ✅ "api/products" no solo "products"
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get() // ← Esto responde a GET /api/products
  async getProducts(@Query('category') category: string) {
    return this.productsService.getProducts(category);
  }
}