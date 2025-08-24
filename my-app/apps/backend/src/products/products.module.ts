
import { Module } from '@nestjs/common';
import { ProductsService } from '../products/products.services';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}