import { 
  Controller, 
  Get, 
  Query, 
  Param, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common'; 
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

  // ✅ Nuevo endpoint: obtener producto por ID
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productsService.getProductById(Number(id));
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  // ✅ Nuevo endpoint: obtener productos filtrados
  @Get('filtered/list')
  async getFilteredProducts(
    @Query('category') category: string,
    @Query('subcategory') subcategory?: string,
    @Query('sizes') sizes?: string,
    @Query('colors') colors?: string,
    @Query('brands') brands?: string,
    @Query('priceRange') priceRange?: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    try {
      return this.productsService.getFilteredProducts({
        category,
        subcategory,
        sizes,
        colors,
        brands,
        priceRange,
        sortBy,
        sortOrder,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      console.error('❌ Error en getFilteredProducts:', error);
      throw new BadRequestException('Error al obtener productos filtrados');
    }
  }
}