import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JsonValue } from '@prisma/client/runtime/library';
import { IdGeneratorService } from '../../common/services/id-generator.service';

// Interfaz actualizada para el producto de Prisma
interface PrismaProduct {
  id: number;
  newId: string | null;
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

interface FilterOptions {
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

  private enhanceProduct(product: any) {
    const productTyped = product as PrismaProduct;
    
    return {
      ...productTyped,
      mainImageUrl: this.buildImageUrl(productTyped.mainImage),
      images: (productTyped.images || []).map(img => this.buildImageUrl(img)),
      colorImages: this.buildColorImages(productTyped.colorImages),
    };
  }

  // ✅ Crear producto con ID semántico en newId
  async createProduct(productData: any) {
    try {
      const newId = await this.idGenerator.generateProductId(productData.category);
      
      const product = await this.prisma.product.create({
        data: { 
          ...productData, 
          newId
        }
      });

      return this.enhanceProduct(product);
    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw new BadRequestException('Error creating product');
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

      const productsWithImages = products.map(product => this.enhanceProduct(product));

      return { 
        products: productsWithImages, 
        total: productsWithImages.length 
      };
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw new BadRequestException('Error fetching products');
    }
  }

  // ✅ Buscar por ID numérico (ID principal) - CORREGIDO: image → images
  async getProductById(id: string) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new BadRequestException('ID de producto inválido');
      }

      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          images: true,    // ← CORREGIDO: image → images
          sizes: true,
          colors: true,
        }
      });

      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }

      return this.enhanceProduct(product);
    } catch (error) {
      console.error('❌ Error fetching product by ID:', error);
      
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException('Error al obtener el producto');
    }
  }

  // ✅ Buscar por newId (ID semántico) - CORREGIDO: image → images
  async getProductByNewId(newId: string) {
    try {
      const product = await this.prisma.product.findFirst({ 
        where: { newId },
        include: {
          images: true,    // ← CORREGIDO: image → images
          sizes: true,
          colors: true,
        }
      });

      if (!product) {
        throw new NotFoundException(`Producto con newId ${newId} no encontrado`);
      }

      return this.enhanceProduct(product);
    } catch (error) {
      console.error('❌ Error fetching product by newId:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException('Error al obtener el producto');
    }
  }

  async getFeaturedProducts() {
    try {
      const products = await this.prisma.product.findMany({
        where: { featured: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      const productsWithImages = products.map(product => this.enhanceProduct(product));

      return { 
        products: productsWithImages, 
        total: productsWithImages.length 
      };
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      throw new BadRequestException('Error fetching featured products');
    }
  }

  async getFilteredProducts(filters: FilterOptions) {
    try {
      const where: any = {};
      
      if (filters.category) where.category = filters.category;
      if (filters.subcategory) where.subcategory = filters.subcategory;
      if (filters.brands?.length) where.brand = { in: filters.brands };
      if (filters.sizes?.length) where.sizes = { hasSome: filters.sizes };
      if (filters.colors?.length) where.colors = { hasSome: filters.colors };
      
      if (filters.priceRange) {
        where.price = { 
          gte: filters.priceRange[0], 
          lte: filters.priceRange[1] 
        };
      }

      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const skip = (page - 1) * limit;

      const [products, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          where,
          orderBy: filters.sortBy 
            ? { [filters.sortBy]: filters.sortOrder || 'desc' }
            : { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.product.count({ where }),
      ]);

      const productsWithImages = products.map(product => this.enhanceProduct(product));

      return {
        products: productsWithImages,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      };
    } catch (error) {
      console.error('❌ Error fetching filtered products:', error);
      throw new BadRequestException('Error fetching filtered products');
    }
  }

  // ✅ Migrar IDs existentes
  async migrateProductIds() {
    try {
      const products = await this.prisma.product.findMany();
      
      let migratedCount = 0;
      const errors: string[] = [];

      for (const product of products) {
        try {
          // Solo generar newId si no existe
          if (!product.newId) {
            const newId = await this.idGenerator.generateProductId(product.category);
            
            await this.prisma.product.update({
              where: { id: product.id },
              data: { newId }
            });

            migratedCount++;
            console.log(`✅ Migrado: ${product.id} -> newId: ${newId}`);
          } else {
            console.log(`⏭️  Saltado: ${product.id} (ya tiene newId: ${product.newId})`);
          }
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
        skipped: products.length - migratedCount,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('❌ Error en migración de IDs:', message);
      throw new BadRequestException('Error durante la migración de IDs');
    }
  }

  // ✅ Método auxiliar para detectar tipo de ID
  isPrismaId(identifier: string): boolean {
    return /^[a-f0-9]{24}$/.test(identifier);
  }

  // ✅ Método unificado para obtener producto por cualquier tipo de ID
  async getProductByIdentifier(identifier: string) {
    if (this.isPrismaId(identifier)) {
      return this.getProductById(identifier);
    } else {
      return this.getProductByNewId(identifier);
    }
  }
}