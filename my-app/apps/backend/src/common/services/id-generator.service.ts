import { Injectable } from '@nestjs/common';

@Injectable()
export class IdGeneratorService {
  
  private getCategoryPrefix(category: string): string {
    const prefixMap: { [key: string]: string } = {
      'hombre': 'HOM',
      'mujer': 'MUJ', 
      'niño': 'NIN',
      'ninos': 'NIN',
      'niños': 'NIN',
      'accesorios': 'ACC',
      'accesorio': 'ACC',
      'unisex': 'UNI',
      'infantil': 'INF'
    };
    return prefixMap[category.toLowerCase()] || 'PRO';
  }

  async generateProductId(category: string): Promise<string> {
    const prefix = this.getCategoryPrefix(category);
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  async migrateExistingProduct(oldId: number, category: string): Promise<string> {
    const prefix = this.getCategoryPrefix(category);
    return `${prefix}-${oldId.toString().padStart(6, '0')}`;
  }
}