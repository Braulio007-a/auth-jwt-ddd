/* eslint-disable @typescript-eslint/no-floating-promises */
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // opcional para testes
  await app.listen(3000);
}
bootstrap();
