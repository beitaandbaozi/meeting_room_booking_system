import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class UnLoginException {
    message: string;
    constructor(message?: any);
}
export declare class UnLoginFilter implements ExceptionFilter {
    catch(exception: UnLoginException, host: ArgumentsHost): void;
}
