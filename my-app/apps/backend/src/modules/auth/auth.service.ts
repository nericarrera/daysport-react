import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // -------------------- Registro --------------------
  async register(registerDto: RegisterDto) {
    const { email, password, name, phone, address, postalCode, birthDate } = registerDto;

    // Validar si ya existe
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { 
        email,
        password: hashedPassword,
        name,
        phone,
        address,
        postalCode,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    });

    return { message: 'User registered successfully', user: { ...user, password: undefined } };
  }

  // -------------------- Validación de usuario --------------------
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return user;
  }

  // -------------------- Login --------------------
  async login(user: { id: number; email: string; name?: string }) {
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { message: 'Login successful', access_token: token, user: { id: user.id, email: user.email, name: user.name } };
  }

  // -------------------- Recuperación de contraseña --------------------
  async sendResetPasswordEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email not found');

    const token = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Expira en 1 hora

    await this.prisma.resetToken.create({
      data: {
        token,
        userId: user.id,
        expires,
      },
    });

    // Temporal: devolver token para testing
    return { message: 'Reset password email sent', token };
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