import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');

  constructor(private configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'object'
          ? (res as any).message || (res as any).error
          : res;
      errorCode = 'HTTP_EXCEPTION';
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma errors hardening
      status = HttpStatus.BAD_REQUEST;
      message = 'Database request failed';
      errorCode = `DB_${exception.code}`;
      this.logger.error(
        `Prisma Error: ${exception.code} - ${exception.message}`,
      );
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`System Error: ${exception.message}`, exception.stack);
    }

    const correlationId = request.headers['x-correlation-id'] || 'N/A';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message : [message],
      errorCode,
      correlationId,
      ...(isProduction
        ? {}
        : { stack: exception instanceof Error ? exception.stack : null }),
    };

    this.logger.warn(
      `[${correlationId}] ${request.method} ${request.url} - Status: ${status} - Error: ${JSON.stringify(message)}`,
    );

    response.status(status).json(errorResponse);
  }
}
