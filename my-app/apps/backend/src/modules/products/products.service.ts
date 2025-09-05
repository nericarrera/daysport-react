import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JsonValue } from '@prisma/client/runtime/library';
import { IdGeneratorService } from '../../common/services/id-generator.service'; // ← Corregido

// Interfaz actualizada para el producto de Prisma
interface PrismaProduct {
  id: number; // ← MANTENER como number hasta cambiar el schema
  newId: string | null; // ← Corregido mayúscula
  brand?: string | null;
  discountPercentage?: number | null;
  reviewCount?: number | null;
  rating?: number | null;
  stockQuantity?: number | null;
  specifications?: JsonValue;
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
  constructor(
    private prisma: PrismaService,
    private idGenerator: IdGeneratorService
  ) {}

  private buildImageUrl(imagePath: string): string {
    const host = process.env.HOST_BACKEND || 'http://localhost:3001';
    
    if (!imagePath) return `${host}/assets/images/placeholder.jpg`;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/assets/')) return `${host}${imagePath}`;
    if (imagePath.startsWith('/images/')) return `${host}/assets${imagePath}`;
    if (imagePath.startsWith('images/')) return `${host}/assets/${imagePath}`;
    
    return `${host}/assets/images/${imagePath}`;
  }

  private parseColorImages(colorImages: JsonValue | null | undefined): Record<string, string[]> {
    if (!colorImages || typeof colorImages !== 'object' || colorImages === null) return {};
    
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

  // ✅ Crear producto con ID semántico en newId (NO en id principal)
  async createProduct(productData: any) {
    try {
      const newId = await this.idGenerator.generateProductId(productData.category);
      const product = await this.prisma.product.create({
        data: { 
          ...productData, 
          newId // ← Usar newId, NO sobreescribir id principal
        }
      });

      const productTyped = product as unknown as PrismaProduct;

      return { 
        ...productTyped, 
        mainImageUrl: this.buildImageUrl(productTyped.mainImage),
        images: (productTyped.images || []).map(img => this.buildImageUrl(img)),
        colorImages: this.buildColorImages(productTyped.colorImages),
      };
    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw new Error('Error creating product');
    }
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

      const productsWithImages = products.map((p: any) => {
        const product = p as PrismaProduct;
        return {
          ...product,
          mainImageUrl: this.buildImageUrl(product.mainImage),
          images: (product.images || []).map(img => this.buildImageUrl(img)),
          colorImages: this.buildColorImages(product.colorImages),
        };
      });

      return { products: productsWithImages, total: productsWithImages.length };
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  }

  // ✅ Buscar por ID numérico (porque el ID principal sigue siendo number)
  async getProductById(id: string) {
    try {
      // Convertir a número porque el ID principal es number
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new NotFoundException('ID de producto inválido');
      }

      const product = await this.prisma.product.findUnique({
        where: { id } // ← Buscar por ID numérico
      });

      if (!product) throw new NotFoundException('Product not found');

      const productTyped = product as unknown as PrismaProduct;

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
          images: (product.images || []).map(img => this.buildImageUrl(img)),
          colorImages: this.buildColorImages(product.colorImages),
        };
      });

      return { products: productsWithImages, total: productsWithImages.length };
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      throw new Error('Error fetching featured products');
    }
  }

  async getFilteredProducts(filters: {
    category?: string;
    subcategory?: string;
    sizes?: string[];
    colors?: string[];
    brands?: string[];
    priceRange?: [number, number];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const where: any = {};
      if (filters.category) where.category = filters.category;
      if (filters.subcategory) where.subcategory = filters.subcategory;
      if (filters.brands) where.brand = { in: filters.brands };
      if (filters.sizes) where.sizes = { hasSome: filters.sizes };
      if (filters.colors) where.colors = { hasSome: filters.colors };
      if (filters.priceRange) {
        where.price = { gte: filters.priceRange[0], lte: filters.priceRange[1] };
      }

      const page = filters.page || 1;
      const limit = filters.limit || 12;

      const [products, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          where,
          orderBy: filters.sortBy
            ? { [filters.sortBy]: filters.sortOrder || 'asc' }
            : { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.product.count({ where }),
      ]);

      const productsWithImages = products.map((p: any) => {
        const product = p as PrismaProduct;
        return {
          ...product,
          mainImageUrl: this.buildImageUrl(product.mainImage),
          images: (product.images || []).map(img => this.buildImageUrl(img)),
          colorImages: this.buildColorImages(product.colorImages),
        };
      });

      return {
        products: productsWithImages,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('❌ Error fetching filtered products:', error);
      throw new Error('Error fetching filtered products');
    }
  }

  // ✅ Migrar IDs existentes (CORREGIDO - sin parámetro)
  async migrateProductIds() {
    try {
      const products = await this.prisma.product.findMany();
      
      let migratedCount = 0;
      const errors: string[] = [];

      for (const product of products) {
        try {
          const newId = await this.idGenerator.generateProductId(product.category);
          
          // Solo actualizar el campo newId, NO el id principal
          await this.prisma.product.update({
            where: { id: product.id },
            data: { newId }
          });

          migratedCount++;
          console.log(`✅ Migrado: ${product.id} -> newId: ${newId}`);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          const errorMsg = `Error migrando producto ${product.id}: ${message}`;
          errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      return {
        success: true,
        migrated: migratedCount,
        total: products.length,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('❌ Error en migración de IDs:', message);
      throw new Error('Error durante la migración de IDs');
    }
  }

  // ✅ Buscar por newId en lugar del id numérico
  async getProductByNewId(newId: string) {
    try {
      const product = await this.prisma.product.findFirst({ 
        where: { newId } 
      });

      if (!product) throw new NotFoundException('Product not found');

      const productTyped = product as unknown as PrismaProduct;

      return { 
        ...productTyped, 
        mainImageUrl: this.buildImageUrl(productTyped.mainImage),
        images: (productTyped.images || []).map(img => this.buildImageUrl(img)),
        colorImages: this.buildColorImages(productTyped.colorImages),
      };
    } catch (error: unknown) {
      console.error('❌ Error fetching product by newId:', error);
      throw error;
    }
  }
}