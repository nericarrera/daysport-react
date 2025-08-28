import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

// Interfaz para el producto de Prisma
interface PrismaProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  mainImage: string;
  images?: string[];
  colorImages?: Record<string, string[]>;
  featured?: boolean;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private buildImageUrl(imagePath: string): string {
    const host = process.env.HOST_BACKEND || 'http://localhost:3001';
    
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/assets/')) return `${host}${imagePath}`;
    if (imagePath.startsWith('/images/')) return `${host}/assets${imagePath}`;
    if (imagePath.startsWith('images/')) return `${host}/assets/${imagePath}`;
    
    return `${host}/assets/images/${imagePath}`;
  }

  private buildColorImages(colorImages: Record<string, string[]>): Record<string, string[]> {
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

      // DEBUG: Ver qué hay en la base de datos
      console.log('📦 Productos de BD:', products.map((p: PrismaProduct) => ({
        id: p.id,
        name: p.name,
        mainImage: p.mainImage,
        images: p.images
      })));

      const productsWithImages = products.map((p: PrismaProduct) => ({
        ...p,
        mainImageUrl: this.buildImageUrl(p.mainImage),
        images: p.images ? p.images.map((img: string) => this.buildImageUrl(img)) : [],
        colorImages: p.colorImages ? this.buildColorImages(p.colorImages) : {},
      }));

      return { products: productsWithImages, total: productsWithImages.length };
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  }

  async getProductById(id: number) {
    try {
      const product = await this.prisma.product.findUnique({ 
        where: { id } 
      }) as PrismaProduct | null;
      
      if (!product) throw new NotFoundException('Product not found');

      return { 
        ...product, 
        mainImageUrl: this.buildImageUrl(product.mainImage),
        images: product.images ? product.images.map(img => this.buildImageUrl(img)) : [],
        colorImages: product.colorImages ? this.buildColorImages(product.colorImages) : {},
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
      }) as PrismaProduct[];

      const productsWithImages = products.map((p: PrismaProduct) => ({
        ...p,
        mainImageUrl: this.buildImageUrl(p.mainImage),
        images: p.images ? p.images.map((img: string) => this.buildImageUrl(img)) : [],
        colorImages: p.colorImages ? this.buildColorImages(p.colorImages) : {},
      }));

      return { products: productsWithImages, total: productsWithImages.length };
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      throw new Error('Error fetching featured products');
    }
  }
}