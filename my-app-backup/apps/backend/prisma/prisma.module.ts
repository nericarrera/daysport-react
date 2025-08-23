import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 🔑 Muy importante exportarlo para otros módulos
})
export class PrismaModule {}