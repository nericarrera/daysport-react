import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(email: string, password: string) {
    // 1. Buscar usuario en DB
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    // 2. Comparar contraseña hasheada
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Credenciales incorrectas');

    // 3. Generar JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret-key', // Cambia esto en producción
      { expiresIn: '1h' }
    );

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }
}