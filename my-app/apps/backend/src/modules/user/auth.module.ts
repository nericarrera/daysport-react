// apps/backend/src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Post('register')
  async register(@Body() data: { email: string; password: string; name?: string }) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: data.password, // En producción usa bcrypt!
          name: data.name,
        },
      });
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'El email ya existe' };
    }
  }
}