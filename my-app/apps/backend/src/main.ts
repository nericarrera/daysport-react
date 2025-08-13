import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*", // temporal para pruebas; luego podés restringir a tu frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });

  await app.listen(3001, '0.0.0.0'); // <- muy importante
  console.log(`Backend corriendo en http://0.0.0.0:3001`);
}
bootstrap();