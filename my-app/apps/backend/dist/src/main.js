"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common"); // <-- Importar aquí
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Habilitar CORS (temporal para pruebas)
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    });
    // Activar validación global de DTOs
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true, // elimina propiedades que no estén en el DTO
        forbidNonWhitelisted: true, // lanza error si llega algo extra
        transform: true, // convierte automáticamente tipos (por ejemplo string -> number)
    }));
    await app.listen(3001, '0.0.0.0');
    console.log(`Backend corriendo en http://0.0.0.0:3001`);
}
bootstrap();
