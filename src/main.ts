import './dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './server.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: serverConfig.origin,
      credentials: true,
    },
    bodyParser: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(serverConfig.port);
  console.log(`Server running on http://localhost:${serverConfig.port}`);
}
bootstrap();
