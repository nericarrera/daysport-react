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
      'unisex': 'uni',
      'infantil': 'nino'
    };

    return prefixMap[category.toLowerCase()] || 'prod';
  }

  async generateProductId(category: string): Promise<string> {
    const prefix = this.getCategoryPrefix(category);
    
    // Buscar el último ID existente para esta categoría
    const lastProduct = await this.prisma.product.findFirst({
      where: {
        id: {
          startsWith: prefix + '-'
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
    
    if (lastProduct) {
      // Extraer el número del último ID
      const idString = lastProduct.id.toString(); // ← Asegurar que es string
      const match = idString.match(new RegExp(`${prefix}-(\\d+)$`));
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `${prefix}-${nextNumber.toString().padStart(4, '0')}`;
  }

  // Para migrar productos existentes (versión segura)
  async migrateExistingProduct(oldId: string, category: string): Promise<string> {
    const prefix = this.getCategoryPrefix(category);
    return `${prefix}-${oldId.padStart(4, '0')}`;
  }

  // ✅ NUEVO MÉTODO: Para manejar la transición
  async findProductById(id: string | number) {
    if (typeof id === 'number') {
      // Buscar por ID numérico durante la transición
      return this.prisma.product.findFirst({
        where: {
          OR: [
            { id: id.toString() }, // Para IDs ya migrados
            { id: id.toString() }  // Para IDs numéricos legacy
          ]
        }
      });
    }
    
    return this.prisma.product.findUnique({
      where: { id }
    });
  }
}