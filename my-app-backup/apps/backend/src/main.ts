import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug'],
    });

    const configService = app.get(ConfigService);

    // ✅ Configuración CORS unificada
    const corsOptions = {
      origin: configService.get('FRONTEND_URL')?.split(',') || ['http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    };

    app.enableCors(corsOptions);

    // ✅ Validación global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        disableErrorMessages: configService.get('NODE_ENV') === 'production',
      }),
    );

    // ✅ Configuración de puerto y host
    const port = configService.get<number>('PORT') || 3001;
    const host = configService.get('HOST') || '0.0.0.0';

    await app.listen(port, host);

    logger.log(`🚀 Servidor escuchando en ${await app.getUrl()}`);
    logger.debug(`Modo: ${configService.get('NODE_ENV') || 'development'}`);
    logger.debug(`Configuración CORS: ${JSON.stringify(corsOptions)}`);
  } catch (error) {
    logger.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();