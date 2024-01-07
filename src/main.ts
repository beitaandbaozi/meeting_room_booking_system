import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { UnLoginFilter } from './filter/unlogin.filter';
import { CustomExceptionFilter } from './filter/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // todo 全局启用
  app.useGlobalPipes(new ValidationPipe());
  // todo 全局启动拦截器
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // todo 全局使用 exception filter
  app.useGlobalFilters(new UnLoginFilter());
  app.useGlobalFilters(new CustomExceptionFilter());
  // todo swagger 生成api文档
  const config = new DocumentBuilder()
    .setTitle('BEITA会议室预订系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBasicAuth({
      type: 'http',
      description: '基于jwt的认证',
    })
    .build();
  const document = await SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  // todo 使用config配置端口地址
  const configService = app.get(ConfigService);
  await app.listen(configService.get(`NEST_SERVER_PORT`));
}
bootstrap();
