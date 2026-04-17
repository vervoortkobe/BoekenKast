import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { seed } from './seeding/seeding.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await seed();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
