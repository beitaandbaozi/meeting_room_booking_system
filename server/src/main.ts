import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // todo 全局启用 ValidationPipe 对请求体进行校验
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
