import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addItem(userId: String, productId: String, quantity: number = 1) {
    const cart = await this.getOrCreateCart(userId);
    
    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId.toString(),
        }
      },
      update: { quantity },
      create: {
        cartId: cart.id,
        productId: productId.toString(),
        quantity
      }
    });
  }

  private async getOrCreateCart(userId: String) {
    return this.prisma.cart.upsert({
      where: { userId: userId.toString() },
      create: { userId: userId.toString() },
      update: {}
    });
  }
}