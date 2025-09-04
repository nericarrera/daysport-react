import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class IdGeneratorService {
  constructor(private prisma: PrismaService) {}

  private getCategoryPrefix(category: string): string {
    const prefixMap: { [key: string]: string } = {
      'hombre': 'hombre',
      'mujer': 'mujer', 
      'niño': 'nino',
      'ninos': 'nino',
      'niños': 'nino',
      'accesorios': 'acc',
      'accesorio': 'acc',
      'unisex': 'uni'
    };

    return prefixMap[category.toLowerCase()] || 'prod';
  }

  async generateProductId(category: string): Promise<string> {
    const prefix = this.getCategoryPrefix(category);
    
    // Buscar el último ID existente para esta categoría
    const lastProduct = await this.prisma.product.findFirst({
      where: {
        id: {
          startsWith: prefix
        }
      },
      orderBy: {
        id: 'desc'
      },
      select: {
        id: true
      }
    });

    let nextNumber = 1;
    
    if (lastProduct && lastProduct.id.startsWith(prefix)) {
      // Extraer el número del último ID
      const match = lastProduct.id.match(new RegExp(`${prefix}-(\\d+)$`));
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `${prefix}-${nextNumber.toString().padStart(4, '0')}`;
  }

  // Para migrar productos existentes
  async migrateExistingProduct(oldId: number, category: string): Promise<string> {
    const prefix = this.getCategoryPrefix(category);
    return `${prefix}-${oldId.toString().padStart(4, '0')}`;
  }
}