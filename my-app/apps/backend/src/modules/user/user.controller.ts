import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  // Crear usuario manualmente
  @Post()
  async createUser(@Body() data: { email: string; password: string; name?: string }) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
    return { success: true, user };
  }

  // Obtener perfil del usuario autenticado
@Get('profile')
@UseGuards(AuthGuard('jwt'))
async getProfile(@Req() req: Request) {
  const user = await this.prisma.user.findUnique({
    where: { id: (req.user as any).sub }, // req.user no está tipado por default
    select: { id: true, email: true, name: true, phone: true, address: true, birthDate: true, createdAt: true }
  });
  return user;
}
}


