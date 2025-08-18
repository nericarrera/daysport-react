import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    // ConfigModule global para poder usar ConfigService en cualquier módulo
    ConfigModule.forRoot({
      isGlobal: true,            // Disponible en toda la app
      envFilePath: '.env',       // Archivo de variables de entorno
      expandVariables: true,     // Permite usar variables anidadas
    }),

    // Módulos de la aplicación
    AuthModule,
    UserModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}