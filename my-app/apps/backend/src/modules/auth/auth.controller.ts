import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

class RegisterDto {
  email!: string;
  password!: string;
  name?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}  // Añadido readonly

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}