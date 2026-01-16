import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export interface ErrorResponse {
  data: null;
  code: number;
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        typeof exceptionResponse === 'object'
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        const msg = responseObj.message || responseObj.error || '请求失败';
        if (Array.isArray(msg)) {
          message = msg.join(', ');
        } else if (typeof msg === 'string') {
          message = msg;
        } else {
          message = '请求失败';
        }
      } else {
        message = '请求失败';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '服务器内部错误';
    }

    const errorResponse: ErrorResponse = {
      data: null,
      code: status,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
