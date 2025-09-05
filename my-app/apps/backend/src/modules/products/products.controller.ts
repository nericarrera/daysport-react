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

  // GET /api/products?category=&subcategory=
  @Get()
  async getProducts(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
  ) {
    try {
      return this.productsService.getProducts(category, subcategory);
    } catch (error) {
      console.error('❌ Error en getProducts:', error);
      throw new BadRequestException('Error al obtener productos');
    }
  }

  // GET /api/products/filtered/list?category=&colors=&brands=&...
  @Get('filtered/list')
  async getFilteredProducts(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('sizes') sizes?: string,      // CSV string
    @Query('colors') colors?: string,    // CSV string
    @Query('brands') brands?: string,    // CSV string
    @Query('priceRange') priceRange?: string, // "min,max"
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    try {
      // Convertir CSV a array
      const sizesArray = sizes ? sizes.split(',').map(s => s.trim()) : undefined;
      const colorsArray = colors ? colors.split(',').map(c => c.trim()) : undefined;
      const brandsArray = brands ? brands.split(',').map(b => b.trim()) : undefined;

      // Convertir priceRange a tupla [min, max]
      let priceTuple: [number, number] | undefined = undefined;
      if (priceRange) {
        const parts = priceRange.split(',').map(p => Number(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          priceTuple = [parts[0], parts[1]];
        }
      }

      return this.productsService.getFilteredProducts({
        category,
        subcategory,
        sizes: sizesArray,
        colors: colorsArray,
        brands: brandsArray,
        priceRange: priceTuple,
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

  // GET /api/products/:id
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      const product = await this.productsService.getProductById(String(id));
      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      return product;
    } catch (error) {
      console.error('❌ Error en getProductById:', error);
      throw new BadRequestException('Error al obtener el producto');
    }
  }
}