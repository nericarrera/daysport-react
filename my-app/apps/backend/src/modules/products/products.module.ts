import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { IdGeneratorService } from '../../common/services/id-generator.service'; // ← Importar

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    IdGeneratorService, // ← Añadir aquí
  ],
  exports: [
    ProductsService,
    IdGeneratorService, // ← Opcional: exportar si otros módulos lo necesitan
  ],
})
export class ProductsModule {}