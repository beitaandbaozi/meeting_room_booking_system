import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. reflector 从目标 controller 和 handler 拿到 require-permission 的 metadata
    const requirePermission = this.reflector.getAllAndOverride(
      'require-permission',
      [context.getHandler(), context.getClass()],
    );
    if (!requirePermission) return true;
    // 2. 检查当前用户是否有访问的权限（loginGuard那边已经进行赋值操作）
    const request: Request = context.switchToHttp().getRequest();
    const permissions = request.user.permissions;
    for (let i = 0; i < requirePermission.length; i++) {
      const curPermission = requirePermission[i];
      const found = permissions.find((item) => item.code === curPermission);
      if (!found) {
        throw new UnauthorizedException('你没有访问该接口的权限');
      }
    }
    return true;
  }
}
