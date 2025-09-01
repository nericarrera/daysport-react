import { Controller, Get, Query, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
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

  // ✅ Nuevo endpoint para detalle de producto
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productsService.getProductById(Number(id));
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }
}