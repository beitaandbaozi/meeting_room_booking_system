export declare const RequireLogin: () => import("@nestjs/common").CustomDecorator<string>;
export declare const RequirePermission: (...permissions: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const UserInfo: (...dataOrPipes: (string | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
