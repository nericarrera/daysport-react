import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔹 Habilitar CORS para permitir llamadas desde el frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.1.34:3000'], // tus URLs de frontend
    credentials: true, // para enviar cookies si después las usamos
  });

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();