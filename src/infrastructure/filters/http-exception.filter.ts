import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        // 针对不同状态码定制响应
        if (status === HttpStatus.UNAUTHORIZED) {
            response
                .status(status)
                .json({
                    success: false,
                    message: '认证失败，请重新登录',
                    code: 'AUTH_FAILED',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
        } else {
            response
                .status(status)
                .json({
                    success: false,
                    message: exception.message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
        }
    }
} 