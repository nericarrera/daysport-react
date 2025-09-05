import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // ← Asegúrate de que exporta el servicio
})
export class PrismaModule {}