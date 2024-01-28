import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UnLoginException } from 'src/filter/unlogin.filter';
import { Permission } from 'src/user/entities/permission.entity';

interface JwtUserData {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}
@Injectable()
export class LoginGuard implements CanActivate {
  // todo 引入 reflector
  @Inject()
  private reflector: Reflector;
  // todo 引入 jwt
  @Inject(JwtService)
  private jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. 当前接口是否需要进行登录权限校验
    // ***  reflector 从目标 controller 和 handler 上拿到 require-login 的 metadata
    const isRequireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);
    // 1.1 如果没有，说明不需要拦截，直接放过
    if (!isRequireLogin) return true;
    // 2. 进行jwt校验
    // 2.1 请求头是否有token
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      // throw new UnauthorizedException('用户未登录😷');
      throw new UnLoginException('用户未登录😷');
    }
    // 2.2 正式进行校验
    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);
      request.user = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
      };
      return true;
    } catch (error) {
      // throw new UnauthorizedException('token失效,请重新登录🫡');
      throw new UnLoginException('token失效,请重新登录🫡');
    }
  }
}
