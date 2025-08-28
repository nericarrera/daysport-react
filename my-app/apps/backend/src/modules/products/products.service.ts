import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JsonValue } from '@prisma/client/runtime/library';

// Interfaz exacta para el producto de Prisma
interface PrismaProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  originalPrice?: number | null;
  category: string;
  subcategory?: string | null;
  mainImage: string;
  images?: string[] | null;
  colorImages?: JsonValue;
  featured?: boolean;
  inStock: boolean;
  stock?: number;
  sizes?: string[] | null;
  colors?: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  sizeGuide?: JsonValue;
  material?: string | null;
  fit?: string | null;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private buildImageUrl(imagePath: string): string {
    const host = process.env.HOST_BACKEND || 'http://localhost:3001';
    
    if (!imagePath) return `${host}/assets/images/placeholder.jpg`;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/assets/')) return `${host}${imagePath}`;
    if (imagePath.startsWith('/images/')) return `${host}/assets${imagePath}`;
    if (imagePath.startsWith('images/')) return `${host}/assets/${imagePath}`;
    
    return `${host}/assets/images/${imagePath}`;
  }

  // Función segura para manejar colorImages como JsonValue - CORREGIDA
  private parseColorImages(colorImages: JsonValue | null | undefined): Record<string, string[]> {
    if (!colorImages || typeof colorImages !== 'object' || colorImages === null) {
      return {};
    }
    
    try {
      const parsed = colorImages as Record<string, unknown>;
      const result: Record<string, string[]> = {};
      
      for (const [color, value] of Object.entries(parsed)) {
        if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
          result[color] = value as string[];
        }
      }
      
      return result;
    } catch {
      return {};
    }
  }

  private buildColorImages(colorImages: JsonValue | null | undefined): Record<string, string[]> {
    const parsed = this.parseColorImages(colorImages);
    return Object.fromEntries(
      Object.entries(parsed).map(([color, images]) => [
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

      // DEBUG: Ver la estructura real
      if (products.length > 0) {
        console.log('📦 Estructura real del primer producto:', JSON.stringify(products[0], null, 2));
      }

      const productsWithImages = products.map((p: any) => {
        const product = p as PrismaProduct;
        return {
          ...product,
          mainImageUrl: this.buildImageUrl(product.mainImage),
          images: (product.images || []).map((img: string) => this.buildImageUrl(img)),
          colorImages: this.buildColorImages(product.colorImages),
        };
      });

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
      });
      
      if (!product) throw new NotFoundException('Product not found');

      const productTyped = product as PrismaProduct;

      return { 
        ...productTyped, 
        mainImageUrl: this.buildImageUrl(productTyped.mainImage),
        images: (productTyped.images || []).map(img => this.buildImageUrl(img)),
        colorImages: this.buildColorImages(productTyped.colorImages),
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

      const productsWithImages = products.map((p: any) => {
        const product = p as PrismaProduct;
        return {
          ...product,
          mainImageUrl: this.buildImageUrl(product.mainImage),
          images: (product.images || []).map((img: string) => this.buildImageUrl(img)),
          colorImages: this.buildColorImages(product.colorImages),
        };
      });

      return { products: productsWithImages, total: productsWithImages.length };
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      throw new Error('Error fetching featured products');
    }
  }
}