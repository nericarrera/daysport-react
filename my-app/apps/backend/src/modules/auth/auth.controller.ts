import { Body, Controller, Post, UnauthorizedException, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Registro de usuario
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  // Login de usuario
  @Post('login')
async login(@Body() body: LoginDto) {
  const user = await this.authService.validateUser(body.email, body.password);

  if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Retorna token JWT + info del usuario
  return this.authService.login(user);
}

  // Recuperación de contraseña
  @Post('send-reset-password')
  async sendResetPasswordEmail(@Body('email') email: string) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  // Ejemplo de ruta protegida
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    return this.authService.getProfile(userId);
  }
}

