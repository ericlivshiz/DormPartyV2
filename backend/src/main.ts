import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://dormpartyv2-production.up.railway.app',
      'https://dormparty-v2-backend-production.up.railway.app',
    ],
    credentials: true,
  });
  console.log(`Listening on port ${process.env.PORT || 3005}`)
  await app.listen(process.env.PORT || 3005);
}
bootstrap();
