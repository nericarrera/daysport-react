import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private buildImageUrl(filename: string): string {
    const host = process.env.HOST_BACKEND || 'http://localhost:3001';
    return `${host}/assets/images/products/${filename}`;
  }

  private buildColorImages(colorImages: Record<string, string[]>): Record<string, string[]> {
    const host = process.env.HOST_BACKEND || 'http://localhost:3001';
    return Object.fromEntries(
      Object.entries(colorImages).map(([color, images]) => [
        color,
        images.map(img => this.buildImageUrl(img))
      ])
    );
  }

  async getProducts(category?: string, subcategory?: string) {
    try {
      const where: any = {};
      if (category) where.category = category;
      if (subcategory) where.subcategory = subcategory;

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      const productsWithImages = products.map((p: any) => ({
        ...p,
        mainImageUrl: this.buildImageUrl(p.mainImage),
        colorImages: p.colorImages ? this.buildColorImages(p.colorImages as Record<string, string[]>) : {},
      }));

      return { products: productsWithImages, total: productsWithImages.length };
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  }

  async getProductById(id: number) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');

      return { 
        ...product, 
        mainImageUrl: this.buildImageUrl(product.mainImage),
        colorImages: product.colorImages ? this.buildColorImages(product.colorImages as Record<string, string[]>) : {},
      };
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      throw error;
    }
  }

  async getFeaturedProducts() {
    try {
      const products = await this.prisma.product.findMany({
        where: { featured: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      const productsWithImages = products.map((p: any) => ({
        ...p,
        mainImageUrl: this.buildImageUrl(p.mainImage),
        colorImages: p.colorImages ? this.buildColorImages(p.colorImages as Record<string, string[]>) : {},
      }));

      return { products: productsWithImages, total: productsWithImages.length };
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      throw new Error('Error fetching featured products');
    }
  }
}