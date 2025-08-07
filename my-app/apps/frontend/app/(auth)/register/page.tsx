import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../packages/database/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: { 
    email: string; 
    password: string; 
    name?: string 
  }) {
    // 1. Verificar si el usuario existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Crear el usuario
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name
      }
    });

    // 4. Generar token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    return { 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
}