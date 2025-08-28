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
    const nodeEnv = configService.get('NODE_ENV') || 'development';

    // ✅ Configuración CORS pro
    const corsOptions = {
      origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) {
          // Permitir llamadas internas (ej: Postman, curl)
          return callback(null, true);
        }

        if (nodeEnv !== 'production') {
          // En desarrollo → aceptar cualquier origen
          return callback(null, true);
        }

        // En producción → solo orígenes permitidos desde .env
        const allowedOrigins = configService.get<string>('FRONTEND_URL')?.split(',') || [];
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          logger.warn(`❌ Bloqueado por CORS: ${origin}`);
          return callback(new Error('Not allowed by CORS'));
        }
      },
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
        disableErrorMessages: nodeEnv === 'production',
      }),
    );

    // ✅ Configuración de puerto y host
    const port = configService.get<number>('PORT') || 3001;
    const host = configService.get('HOST') || '0.0.0.0';

    await app.listen(port, host);

    logger.log(`🚀 Servidor escuchando en ${await app.getUrl()}`);
    logger.debug(`Modo: ${nodeEnv}`);
    logger.debug(`Configuración CORS activa`);
  } catch (error) {
    logger.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();