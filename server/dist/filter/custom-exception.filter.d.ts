import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
