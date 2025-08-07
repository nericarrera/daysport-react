import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('test')
  testEndpoint() {
    return { message: 'Auth endpoint working!' };
  }
}