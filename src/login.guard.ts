import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Permission } from './user/entities/permission.entity';

// todo request 增加属性
interface JwtUserData {
  userId: number;
  username: string;
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
  // todo 注入 reflector
  @Inject()
  private reflector: Reflector;
  // todo 注入 Jwt
  @Inject(JwtService)
  private jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. 获取需要进行登录才能访问的页面
    // 1.1 reflector 从目标 controller 和 handler 拿到 require-login 的 metadata
    // 1.1.1 如果没有，说明不需要登录，返回true
    // 1.1.2 开始第二步
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireLogin) return true;
    // 2. 校验token
    // 2.1 请求头没有token, 说明是直接到对应的页面，但是未登录
    // 2.2 开始校验token
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) throw new UnauthorizedException('用户未登录');
    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);
      request.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('token已经失效,请重新登录');
    }
  }
}
