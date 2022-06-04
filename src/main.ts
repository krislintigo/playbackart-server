import './dotenv';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { serverConfig } from './server.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: serverConfig.origin,
      credentials: true,
    },
    bodyParser: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  await app.listen(serverConfig.port);
  console.log(`Server running on port ${serverConfig.port}`);
}
bootstrap();
