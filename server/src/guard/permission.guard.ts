import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. 获取当前用户所拥有的权限
    const request: Request = context.switchToHttp().getRequest();
    // ??? 在loginGuard中会将数据进行赋值，如果不存在这个对象，说明不需要进行登录，即通过
    if (!request.user) return true;
    // 2. 获取当前接口所需要的权限
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'require-permission',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) return true;
    // 3. 判断用户所拥有的权限是否包含当前接口所需要的权限
    const permissions = request.user.permissions;
    for (let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find((item) => item.code === curPermission);
      if (!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }
    return true;
  }
}
