import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // todo 测试 loginGuard 和 permissionGuard
  @Get('aaa')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ccc'])
  aaaa() {
    return 'aaa';
  }
  // todo 测试 loginGuard 和 permissionGuard
  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
