import { SetMetadata } from '@nestjs/common';

// todo 将 @SetMetadata 封装成自定义装饰器
export const RequireLogin = () => SetMetadata('require-login', true);
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);
