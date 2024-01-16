import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export class UnLoginException {
  message: string;

  constructor(message?) {
    this.message = message;
  }
}
// ??? @Catch 的参数可以指定具体 catch 的异常类型
@Catch(UnLoginException)
export class UnLoginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response
      .json({
        code: HttpStatus.UNAUTHORIZED,
        message: 'fail😭',
        data: exception.message || '用户未登录',
      })
      .end();
  }
}
