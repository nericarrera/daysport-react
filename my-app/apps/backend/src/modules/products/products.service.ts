import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JsonValue } from '@prisma/client/runtime/library';
import { IdGeneratorService } from '../../common/services/id-generator.service';

// Interfaz actualizada para el producto de Prisma (ID como string)
interface PrismaProduct {
  id: string; // ← CAMBIO: Ahora es string
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
    private idGenerator: IdGeneratorService // ← Nuevo servicio inyectado
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

  // Función segura para manejar colorImages como JsonValue
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

  // ✅ NUEVO MÉTODO: Crear producto con ID semántico
  async createProduct(productData: any) {
    try {
      const newId = await this.idGenerator.generateProductId(productData.category);
      
      const product = await this.prisma.product.create({
        data: {
          ...productData,
          id: newId
        }
      });

      const productTyped = product as PrismaProduct;

      return { 
        ...productTyped, 
        mainImageUrl: this.buildImageUrl(productTyped.mainImage),
        images: (productTyped.images || []).map((img: string) => this.buildImageUrl(img)),
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

  // ✅ ACTUALIZADO: Ahora acepta string ID
  async getProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({ 
        where: { id } // ← Ahora busca por string ID
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
        where.price = {
          gte: filters.priceRange[0],
          lte: filters.priceRange[1],
        };
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
          images: (product.images || []).map((img: string) => this.buildImageUrl(img)),
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

  // ✅ NUEVO MÉTODO: Migrar IDs existentes
  async migrateProductIds() {
    try {
      // Obtener todos los productos con ID numérico
      const products = await this.prisma.product.findMany({
        where: {
          id: {
            not: {
              contains: '-'
            }
          }
        }
      });

      let migratedCount = 0;
      const errors: string[] = [];

      for (const product of products) {
        try {
          const newId = await this.idGenerator.migrateExistingProduct(
            parseInt(product.id, 10),
            product.category
          );

          // Actualizar el producto y sus relaciones en una transacción
          await this.prisma.$transaction([
            // Actualizar CartItems
            this.prisma.cartItem.updateMany({
              where: { productId: product.id },
              data: { productId: newId }
            }),
            // Actualizar el producto
            this.prisma.product.update({
              where: { id: product.id },
              data: { id: newId }
            })
          ]);

          migratedCount++;
          console.log(`✅ Migrado: ${product.id} -> ${newId}`);
        } catch (error) {
          const errorMsg = `Error migrando producto ${product.id}: ${error.message}`;
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
    } catch (error) {
      console.error('❌ Error en migración de IDs:', error);
      throw new Error('Error durante la migración de IDs');
    }
  }

  // ✅ NUEVO MÉTODO: Buscar producto por ID legacy (para transición)
  async getProductByIdLegacy(id: number) {
    try {
      // Buscar si existe un producto con el ID numérico
      const product = await this.prisma.product.findUnique({ 
        where: { id: id.toString() } 
      });
      
      if (product) {
        const productTyped = product as PrismaProduct;
        return { 
          ...productTyped, 
          mainImageUrl: this.buildImageUrl(productTyped.mainImage),
          images: (productTyped.images || []).map(img => this.buildImageUrl(img)),
          colorImages: this.buildColorImages(productTyped.colorImages),
        };
      }

      throw new NotFoundException('Product not found');
    } catch (error) {
      console.error('❌ Error fetching product by legacy ID:', error);
      throw error;
    }
  }
}