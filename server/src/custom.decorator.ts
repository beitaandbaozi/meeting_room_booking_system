import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

// todo 将 @SetMetadata 封装成自定义装饰器
export const RequireLogin = () => SetMetadata('require-login', true);
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);

// todo 封装 UserInfo 装饰器，用来取 user 信息传入 handler
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) return null;
    return data ? request.user[data] : request.user;
  },
);
