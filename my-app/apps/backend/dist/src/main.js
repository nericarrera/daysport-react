"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: "*", // temporal para pruebas; luego podés restringir a tu frontend
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    });
    await app.listen(3001, '0.0.0.0'); // <- muy importante
    console.log(`Backend corriendo en http://0.0.0.0:3001`);
}
bootstrap();
