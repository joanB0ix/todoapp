import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet({
    frameguard: {
      action: 'deny'
    }
  }));
  app.enableCors({
    origin: 'https://todo.joanboix.dev'
  });
  await app.listen(3001);
}
bootstrap();
