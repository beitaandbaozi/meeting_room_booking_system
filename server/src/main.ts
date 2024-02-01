import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { UnLoginFilter } from './filter/unlogin.filter';
import { CustomExceptionFilter } from './filter/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // todo 将 uploads 目前设置成静态文件目录，这样可以直接访问上传的图片
  app.useStaticAssets('uploads', { prefix: '/uploads' });
  // todo 开启跨域
  app.enableCors();
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
  // todo swagger配置处理
  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
