// todo 响应内容拦截器，将响应格式修改成 {code、message、data}
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        return {
          code: response.statusCode,
          message: 'success!😆',
          data,
        };
      }),
    );
  }
}
