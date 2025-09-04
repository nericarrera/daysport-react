import { Controller, Get, Param, Query } from '@nestjs/common';
import { FilterService } from '../../modules/products/service/filterservice';

@Controller('filters')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  // Opciones de filtros por categoría
  @Get(':category')
  async getFilterOptions(@Param('category') category: string) {
    return this.filterService.getFilterOptions(category);
  }

  // Productos filtrados
  @Get()
  async getFilteredProducts(
    @Query('category') category: string,
    @Query('subcategory') subcategory?: string,
    @Query('priceRange') priceRange?: string,
    @Query('sizes') sizes?: string,
    @Query('colors') colors?: string,
    @Query('brands') brands?: string,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.filterService.getFilteredProducts({
      category,
      subcategory,
      priceRange,
      sizes: sizes ? sizes.split(',') : [],
      colors: colors ? colors.split(',') : [],
      brands: brands ? brands.split(',') : [],
      sortBy,
      sortOrder,
      page: Number(page),
      limit: Number(limit),
    });
  }
}