import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'Internal server error';
    let errors = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      message = res.message || exception.message;
      errors = res.errors || null;

      // Handle NestJS class-validator default array format
      if (Array.isArray(res.message)) {
        message = 'Validation failed';
        errors = res.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      errors: errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
