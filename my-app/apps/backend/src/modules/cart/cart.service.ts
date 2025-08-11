import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addItem(userId: number, productId: number, quantity: number = 1) {
    const cart = await this.getOrCreateCart(userId);
    
    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      },
      update: { quantity },
      create: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
  }

  private async getOrCreateCart(userId: number) {
    return this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {}
    });
  }
}