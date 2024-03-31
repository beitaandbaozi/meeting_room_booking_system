import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
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
export declare class LoginGuard implements CanActivate {
    private reflector;
    private jwtService;
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
export {};
