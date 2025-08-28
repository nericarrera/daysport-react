import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Creamos la app usando NestExpressApplication
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['log', 'error', 'warn', 'debug'],
    });

    // Configuración del env
    const configService = app.get(ConfigService);
    const nodeEnv = configService.get('NODE_ENV') || 'development';
    const isProduction = nodeEnv === 'production';

    // ------------------------
    // CORS dinámico
    // ------------------------
    const frontendUrls = configService.get<string>('FRONTEND_URL')?.split(',') || [];
    app.enableCors({
      origin: frontendUrls,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    });
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
    // Servir carpeta de imágenes (assets)
    // ------------------------
    // Ruta absoluta segura: desde la raíz del proyecto backend
    const assetsPath = join(__dirname, '..', '..', 'assets');
    if (!existsSync(assetsPath)) {
      logger.error(`❌ La carpeta de assets no existe: ${assetsPath}`);
    } else {
      logger.log(`📂 Servir assets desde: ${assetsPath}`);
      logger.log('📂 Contenido de pantalones:', readdirSync(join(assetsPath, 'images/hombre/pantalones')));
      app.useStaticAssets(assetsPath, { prefix: '/assets/' });
    }

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