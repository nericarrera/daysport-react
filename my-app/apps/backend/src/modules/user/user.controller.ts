import { Controller, Post, Body, Get, Patch, Req, UseGuards } from '@nestjs/common';
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
    console.log('req.user:', req.user); // 👈 para debug del JWT

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
        createdAt: true,
      },
    });

    return user;
  }

  // Actualizar perfil del usuario autenticado
  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() data: { name?: string; phone?: string; address?: string; birthDate?: string },
  ) {
    const userId = (req.user as any)?.sub;
    if (!userId) throw new Error('Usuario no encontrado en el token');

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        birthDate: data.birthDate,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        birthDate: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }
}


