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
@UseGuards(AuthGuard('jwt'))
@Get('profile')
async getProfile(@Req() req: Request) {
  console.log('req.user:', req.user); // 👈 esto nos dice si viene algo del JWT

  const userId = (req.user as any)?.sub;
  if (!userId) {
    throw new Error('Usuario no encontrado en el token');
  }

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      birthDate: true,
      createdAt: true
    }
  });

  return user;
}
}


