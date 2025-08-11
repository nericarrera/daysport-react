import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async createUser(@Body() data: { email: string; password: string; name?: string }) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
    return { success: true, user };
  }
}