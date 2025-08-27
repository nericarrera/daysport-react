import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products') // ← ✅ "api/products" no solo "products"
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

 @Get()
async getProducts(
  @Query('category') category: string,
  @Query('subcategory') subcategory?: string
) {
  return this.productsService.getProducts(category, subcategory);
}
}