// apps/backend/src/products/products.controller.ts
import { Controller, Get, Query, Param, ParseBoolPipe, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ProductsService } from '../products/products.services';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('featured') featured?: string, // ← Cambiado a string
    @Query('inStock') inStock?: string,    // ← Cambiado a string
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
  ) {
    return this.productsService.findAll({
      category,
      subcategory,
      featured: this.parseBoolean(featured), // ← Función de parsing
      inStock: this.parseBoolean(inStock),    // ← Función de parsing
      page,
      limit
    });
  }

  @Get('new')
  findNewProducts(@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number) {
    return this.productsService.findNewProducts(limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // Función helper para parsear booleanos desde strings
  private parseBoolean(value?: string): boolean | undefined {
    if (value === undefined) return undefined;
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    return undefined;
  }
}