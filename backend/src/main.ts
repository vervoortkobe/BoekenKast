import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { seed } from './seeding/seeding.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await seed();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
