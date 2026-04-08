import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: unknown; statusCode: number }
      | { error: string; message: string[]; statusCode: 400 };

    if (typeof err !== 'string' && err.statusCode === 400) {
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message as string,
      });
    }
    response.status(status).json({
      success: false,
      data: err.message as string,
      code: status,
    });
  }
}
