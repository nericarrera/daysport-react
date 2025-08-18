import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap'); // Logger para mensajes estructurados

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug'], // Configuración de logs
    });

    const configService = app.get(ConfigService);

    // 1. Configuración CORS mejorada
    const corsOptions = {
      origin: configService.get('FRONTEND_URL')?.split(',') || [ // Soporta múltiples URLs separadas por comas
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    };

    app.enableCors(corsOptions);
    logger.log(`CORS configurado para: ${corsOptions.origin.join(', ')}`);

    // 2. Validación global con mensajes detallados
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        disableErrorMessages: configService.get('NODE_ENV') === 'production', // Oculta mensajes en producción
      }),
    );

    // 3. Configuración del puerto y host
    const port = configService.get<number>('PORT') || 3001;
    const host = configService.get('HOST') || '0.0.0.0';

    await app.listen(port, host);
    
    logger.log(`🚀 Servidor escuchando en ${await app.getUrl()}`);
    logger.debug(`Modo: ${configService.get('NODE_ENV') || 'development'}`);
    logger.debug(`Configuración CORS: ${JSON.stringify(corsOptions)}`);

  } catch (error) {
    logger.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1); // Cierra la aplicación con código de error
  }
}

bootstrap();