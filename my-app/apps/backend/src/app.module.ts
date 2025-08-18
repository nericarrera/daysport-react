import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importa ConfigModule
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from '../prisma/prisma.module'; // Asumo que usas Prisma

@Module({
  imports: [
    // Configuración del módulo de configuración (debe ir primero)
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigService esté disponible en toda la aplicación
      envFilePath: '.env', // Ruta del archivo .env
      expandVariables: true, // Permite usar variables anidadas en .env
    }),

    // Módulos de tu aplicación
    AuthModule,
    UserModule,
    PrismaModule, // Si usas Prisma
  ],
})
export class AppModule {}