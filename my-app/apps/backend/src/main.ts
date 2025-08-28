import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Creamos la app con logging completo
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug'],
    });

    // Obtenemos configuración desde .env
    const configService = app.get(ConfigService);
    const nodeEnv = configService.get('NODE_ENV') || 'development';
    const isProduction = nodeEnv === 'production';

    // ------------------------
    // Configuración CORS dinámica
    // ------------------------
    const frontendUrls = configService.get<string>('FRONTEND_URL')?.split(',') || [];
    const corsOptions = {
      origin: frontendUrls,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    };
    app.enableCors(corsOptions);

    logger.debug(`Modo: ${nodeEnv}`);
    logger.debug(`CORS habilitado para: ${frontendUrls.join(', ')}`);

    // ------------------------
    // Validación global de DTOs
    // ------------------------
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,                 // elimina propiedades no declaradas en DTO
        forbidNonWhitelisted: true,      // lanza error si llegan propiedades extras
        transform: true,                 // transforma payload a clases DTO
        transformOptions: { enableImplicitConversion: true },
        disableErrorMessages: isProduction, // en producción no mostramos detalles
      }),
    );

    // ------------------------
    // Configuración de puerto y host
    // ------------------------
    const port = configService.get<number>('PORT') || 3001;
    const host = configService.get('HOST') || '0.0.0.0';

    await app.listen(port, host);
    logger.log(`🚀 Servidor escuchando en ${await app.getUrl()}`);
  } catch (error) {
    logger.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();