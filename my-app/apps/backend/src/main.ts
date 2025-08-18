import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap'); // Logger para mensajes estructurados

  try {
    // Crear la app con logging completo
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug'],
    });

    const configService = app.get(ConfigService);

    // 1️⃣ Configuración CORS
    const corsOptions = {
      origin: configService.get('FRONTEND_URL')?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    };
    app.enableCors(corsOptions);
    logger.log(`CORS configurado para: ${corsOptions.origin.join(', ')}`);

    // 2️⃣ Validación global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Solo permite propiedades definidas en DTO
        forbidNonWhitelisted: true, // Lanza error si vienen propiedades extra
        transform: true, // Convierte tipos automáticamente
        transformOptions: { enableImplicitConversion: true },
        disableErrorMessages: configService.get('NODE_ENV') === 'production',
      }),
    );

    // 3️⃣ Configuración de puerto y host
    const port = configService.get<number>('PORT') || 3001;
    const host = configService.get('HOST') || '0.0.0.0';

    await app.listen(port, host);

    logger.log(`🚀 Servidor escuchando en ${await app.getUrl()}`);
    logger.debug(`Modo: ${configService.get('NODE_ENV') || 'development'}`);
    logger.debug(`Configuración CORS: ${JSON.stringify(corsOptions)}`);

  } catch (error) {
    logger.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1); // Cierra la app con error
  }
}

bootstrap();