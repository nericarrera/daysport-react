import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['log', 'error', 'warn', 'debug'],
    });

    const configService = app.get(ConfigService);
    const nodeEnv = configService.get('NODE_ENV') || 'development';
    const isProduction = nodeEnv === 'production';

    const frontendUrls = configService.get<string>('FRONTEND_URL')?.split(',') || [];
    app.enableCors({
      origin: frontendUrls,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    });

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
    const assetsPath = join(__dirname, '..', 'assets'); // Ajuste seguro desde src/
    logger.debug(`📂 Servir assets desde: ${assetsPath}`);
    logger.debug('📂 Existe la carpeta?', existsSync(assetsPath));

    app.useStaticAssets(assetsPath, { prefix: '/assets/' });

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