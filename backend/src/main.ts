import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow frontend to connect (especially WebSocket)
  await app.listen(process.env.PORT || 3005); // Use Railway-assigned port
}
bootstrap();
