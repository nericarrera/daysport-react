// auth.service.ts - VERSIÓN CORREGIDA
import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // -------------------- Registro --------------------
  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name ?? null,
        phone: registerDto.phone ?? null,
        address: registerDto.address ?? null,
        postalCode: registerDto.postalCode ?? null,
        birthDate: registerDto.birthDate ? new Date(registerDto.birthDate) : null,
      },
    });

    // MEJORA: Devolver formato consistente y convertir null a undefined
    return { 
      success: true,
      message: 'Usuario creado correctamente', 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name ?? undefined // Convierte null a undefined
      } 
    };
  }

  // -------------------- Validación de usuario --------------------
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    // CORRECCIÓN: Convertir null a undefined
    return { 
      id: user.id, 
      email: user.email, 
      name: user.name ?? undefined 
    };
  }

  // -------------------- Login --------------------
  async login(user: { id: number; email: string; name?: string }) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      name: user.name 
    };
    
    // MEJORA: Formato claro y consistente
    return {
      success: true,
      message: 'Login exitoso',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  // -------------------- Obtener perfil --------------------
  async getProfile(userId: number) {
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

    if (!user) throw new NotFoundException('Usuario no encontrado');
    
    // CORRECCIÓN: Convertir null a undefined
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      phone: user.phone ?? undefined,
      address: user.address ?? undefined,
      postalCode: user.postalCode ?? undefined,
      birthDate: user.birthDate ?? undefined,
      createdAt: user.createdAt
    };
  }

  // -------------------- Recuperación de contraseña --------------------
  async sendResetPasswordEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email no encontrado');

    const token = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.prisma.resetToken.create({
      data: { token, userId: user.id, expires },
    });

    return { message: 'Token de recuperación generado', token };
  }

  async resetPassword(token: string, password: string) {
    const tokenRecord = await this.prisma.resetToken.findUnique({ where: { token } });
    if (!tokenRecord || tokenRecord.expires < new Date()) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.resetToken.delete({ where: { token } });

    return { message: 'Contraseña actualizada correctamente' };
  }
}