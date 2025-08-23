import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getByCategory(category: string) {
    return this.prisma.product.findMany({
      where: { category },
    });
  }
}