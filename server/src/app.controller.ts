import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // todo loginGuard测试
  @Get('aaa')
  @SetMetadata('require-login', true)
  aaaa() {
    return 'aaa';
  }
  // todo loginGuard测试
  @Get('bbb')
  bbbb() {
    return 'bbbb';
  }
}
