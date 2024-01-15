import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission } from './custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // todo loginGuard测试
  @Get('aaa')
  @RequireLogin()
  @RequirePermission('ddd')
  aaaa() {
    return 'aaa';
  }
  // todo loginGuard测试
  @Get('bbb')
  bbbb() {
    return 'bbbb';
  }
}
