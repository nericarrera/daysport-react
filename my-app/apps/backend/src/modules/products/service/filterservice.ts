import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

interface FilterQuery {
  category: string;
  subcategory?: string;
  priceRange?: string;
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

@Injectable()
export class FilterService {
  constructor(private prisma: PrismaService) {}

  // Opciones de filtros por categoría
  async getFilterOptions(category: string) {
    // Ejemplo: traer valores únicos desde la base
    const sizes = await this.prisma.product.findMany({
      where: { category },
      distinct: ['sizes'],
      select: { sizes: true },
    });

    const colors = await this.prisma.product.findMany({
      where: { category },
      distinct: ['colors'],
      select: { colors: true },
    });

    const brands = await this.prisma.product.findMany({
      where: { category },
      distinct: ['brand'],
      select: { brand: true },
    });

    return {
      sizes: sizes.flatMap((s) => s.sizes),
      colors: colors.flatMap((c) => c.colors),
      brands: brands.map((b) => b.brand).filter(Boolean),
      priceRanges: [
        { id: '0-25000', label: 'Menos de $25.000' },
        { id: '25000-50000', label: '$25.000 - $50.000' },
        { id: '50000+', label: 'Más de $50.000' },
      ],
      categories: [], // acá podés devolver subcategorías dinámicas
    };
  }

  // Productos filtrados
  async getFilteredProducts(query: FilterQuery) {
    const { category, subcategory, priceRange, sizes, colors, brands, sortBy, sortOrder, page, limit } = query;

    const where: any = { category };

    if (subcategory) where.subcategory = subcategory;
    if (sizes && sizes.length > 0) where.sizes = { hasSome: sizes };
    if (colors && colors.length > 0) where.colors = { hasSome: colors };
    if (brands && brands.length > 0) where.brand = { in: brands };

    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (max === '+') {
        where.price = { gte: Number(min) };
      } else {
        where.price = { gte: Number(min), lte: Number(max) };
      }
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
    };
  }
}