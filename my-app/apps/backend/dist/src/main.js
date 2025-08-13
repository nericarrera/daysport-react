"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // 🔹 Habilitar CORS para permitir llamadas desde el frontend
    app.enableCors({
        origin: ['http://localhost:3000', 'http://192.168.1.34:3000'], // tus URLs de frontend
        credentials: true, // para enviar cookies si después las usamos
    });
    await app.listen(3001, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
