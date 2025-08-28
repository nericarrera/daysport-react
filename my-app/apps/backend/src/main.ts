import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Creamos la app usando NestExpressApplication
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['log', 'error', 'warn', 'debug'],
    });

    // Configuración de .env
    const configService = app.get(ConfigService);
    const nodeEnv = configService.get('NODE_ENV') || 'development';
    const isProduction = nodeEnv === 'production';

    // ------------------------
    // CORS dinámico
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
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        disableErrorMessages: isProduction,
      }),
    );

    // ------------------------
    // Servir carpeta de imágenes
    // ------------------------
    const assetsPath = join(__dirname, '../../assets'); // apunta a my-app/assets
    app.useStaticAssets(assetsPath, {
      prefix: '/assets', // se accede como http://localhost:3001/assets/images/...
    });

    // ------------------------
    // Puerto y host
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