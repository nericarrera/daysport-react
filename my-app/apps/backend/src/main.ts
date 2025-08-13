import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Importar aquí

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS (temporal para pruebas)
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });

  // Activar validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // lanza error si llega algo extra
      transform: true,        // convierte automáticamente tipos (por ejemplo string -> number)
    }),
  );

  await app.listen(3001, '0.0.0.0');
  console.log(`Backend corriendo en http://0.0.0.0:3001`);
}

bootstrap();

