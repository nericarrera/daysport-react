import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../../../prisma/prisma.module'; // ← Ruta correcta

@Module({
  imports: [PrismaModule], // ← Importar PrismaModule
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}