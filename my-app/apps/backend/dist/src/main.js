"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config"); // 👈 Para variables de entorno
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    // 1. Configuración CORS más segura (evita usar "*" en producción)
    app.enableCors({
        origin: configService.get('FRONTEND_URL') || [
            'http://localhost:3000', // Next.js (dev)
            'https://tudominio.com' // Producción
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true, // 👈 Si usas cookies/tokens
    });
    // 2. Validación global mejorada
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true, // 👈 Conversión automática de tipos
        },
    }));
    // 3. Configuración del puerto desde variables de entorno
    const port = configService.get('PORT') || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`Backend corriendo en: ${await app.getUrl()}`);
}
bootstrap();
