import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  // -------------------- Crear usuario --------------------
  @Post()
  async createUser(@Body() data: { email: string; password: string; name?: string }) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email y contraseña son obligatorios');
    }

    // Validar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name ?? null,
      },
    });

    return {
      success: true,
      message: 'Usuario creado correctamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    };
  }

  // -------------------- Obtener perfil --------------------
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    if (!userId) throw new BadRequestException('Usuario no encontrado en el token');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        postalCode: true,
        birthDate: true,
        createdAt: true,
      },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    return user;
  }

  // -------------------- Actualizar perfil --------------------
  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() data: {
      name?: string;
      phone?: string;
      address?: string;
      postalCode?: string;
      birthDate?: string;
    },
  ) {
    const userId = (req.user as any)?.sub;
    if (!userId) throw new BadRequestException('Usuario no encontrado en el token');

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name ?? undefined,
        phone: data.phone ?? undefined,
        address: data.address ?? undefined,
        postalCode: data.postalCode ?? undefined,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        postalCode: true,
        birthDate: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }
}
