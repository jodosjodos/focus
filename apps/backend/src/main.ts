import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ObserveInstrument, isObserveEnabled } from './observe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    ...(isObserveEnabled() ? { instrument: ObserveInstrument } : {}),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
