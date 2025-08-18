"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const common_2 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_2.Logger('Bootstrap'); // Logger para mensajes estructurados
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['log', 'error', 'warn', 'debug'], // Configuración de logs
        });
        const configService = app.get(config_1.ConfigService);
        // 1. Configuración CORS mejorada
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
        // 2. Validación global con mensajes detallados
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            disableErrorMessages: configService.get('NODE_ENV') === 'production', // Oculta mensajes en producción
        }));
        // 3. Configuración del puerto y host
        const port = configService.get('PORT') || 3001;
        const host = configService.get('HOST') || '0.0.0.0';
        await app.listen(port, host);
        logger.log(`🚀 Servidor escuchando en ${await app.getUrl()}`);
        logger.debug(`Modo: ${configService.get('NODE_ENV') || 'development'}`);
        logger.debug(`Configuración CORS: ${JSON.stringify(corsOptions)}`);
    }
    catch (error) {
        logger.error('❌ Error al iniciar la aplicación:', error);
        process.exit(1); // Cierra la aplicación con código de error
    }
}
bootstrap();
