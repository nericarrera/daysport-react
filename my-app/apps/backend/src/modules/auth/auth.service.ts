import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // Registro
  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = await this.prisma.user.create({
        data: { 
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          phone: registerDto.phone,
          address: registerDto.address,
          postalCode: registerDto.postalCode,
          birthDate: registerDto.birthDate ? new Date(registerDto.birthDate) : null,
        },
      });

      return { message: 'User registered successfully', user };
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  }

  // Login con debug
  async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      console.log('Usuario encontrado en login:', user);

      if (!user) {
        console.log('No se encontró usuario con ese email');
        throw new UnauthorizedException('Invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        console.log('Contraseña incorrecta para el usuario:', email);
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtService.sign({ sub: user.id, email: user.email });
      return { message: 'Login successful', token };
    } catch (error) {
      console.error('Error en login:', error);
      // Lanzamos Unauthorized si es un error esperado, sino lo dejamos pasar
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // Recuperación de contraseña
  async sendResetPasswordEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email not found');

    const token = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.prisma.resetToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      },
    });

    return { message: 'Reset password email sent', token }; // temporalmente devuelvo token para testing
  }

  async resetPassword(token: string, password: string) {
    const tokenRecord = await this.prisma.resetToken.findUnique({ where: { token } });
    if (!tokenRecord || tokenRecord.expires < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.resetToken.delete({ where: { token } });

    return { message: 'Password updated successfully' };
  }
}