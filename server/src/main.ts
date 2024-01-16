import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { UnLoginFilter } from './filter/unlogin.filter';
import { CustomExceptionFilter } from './filter/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // todo 全局启用 ValidationPipe 对请求体进行校验
  app.useGlobalPipes(new ValidationPipe());
  // todo config 配置
  const configService = app.get(ConfigService);
  // todo 全局启用 interceptor
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // todo 全局启用 ExceptionFilter
  app.useGlobalFilters(new UnLoginFilter());
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
