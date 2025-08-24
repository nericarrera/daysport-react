import { Controller, Get, Query, Param, ParseBoolPipe, ParseIntPipe, DefaultValuePipe, Optional } from '@nestjs/common';
import { ProductsService } from '../products/products.services';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
@Get()
findAll(
  @Query('category') category?: string,
  @Query('subcategory') subcategory?: string,
  @Optional() @Query('featured', new ParseBoolPipe()) featured?: boolean,
  @Optional() @Query('inStock', new ParseBoolPipe()) inStock?: boolean,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
) {
  return this.productsService.findAll({
    category,
    subcategory,
    featured,
    inStock,
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
}