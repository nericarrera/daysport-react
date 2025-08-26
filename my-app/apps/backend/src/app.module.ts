import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductsModule } from './modules/products/products.module'; // ← AÑADE ESTA LÍNEA
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),

    // Módulos de la aplicación
    AuthModule,
    UserModule,
    ProductsModule, // ← AÑADE ESTA LÍNEA
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}