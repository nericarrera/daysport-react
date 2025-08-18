import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Registro de usuario
  @Post('register')
  async register(@Body() body: RegisterDto) {
    // Llama al servicio para registrar usuario
    return this.authService.register(body);
  }

  // Login de usuario
 @Post('login')
async login(@Body() body: LoginDto) {
  const user = await this.authService.validateUser(body.email, body.password);

  if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Mapear user para evitar null en el tipo
  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name ?? undefined, // si es null, lo convertimos a undefined
  };

  return this.authService.login(safeUser);
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
}
