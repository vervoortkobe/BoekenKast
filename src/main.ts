import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seed } from './seeding/seeding';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await seed();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
