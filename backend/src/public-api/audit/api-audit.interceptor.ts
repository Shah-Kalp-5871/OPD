import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiAuditService } from './api-audit.service';
import { ApiUsageService } from '../usage/api-usage.service';
import { buildApiClientContext } from '../context/request-api-client.context';

@Injectable()
export class ApiAuditInterceptor implements NestInterceptor {
  constructor(
    private readonly apiAuditService: ApiAuditService,
    private readonly apiUsageService: ApiUsageService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, headers } = request;
    const ipAddress = request.headers['x-forwarded-for'] || request.socket.remoteAddress || 'unknown';
    const userAgent = headers['user-agent'] || 'unknown';
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const clientId = request.clientId;
        if (clientId) {
          const durationMs = Date.now() - startTime;
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode || 200;
          const ip = typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : String(ipAddress);

          this.apiAuditService.logCall({
            clientId,
            endpoint: originalUrl,
            method,
            statusCode,
            ipAddress: ip,
            userAgent,
            durationMs,
          });

          try {
            const ctx = buildApiClientContext(request);
            void this.apiUsageService.recordUsage({
              ctx,
              endpoint: originalUrl,
              method,
              statusCode,
              durationMs,
              responseBytes: Number(response.getHeader?.('content-length') ?? 0) || 0,
            });
          } catch {
            // Context unavailable — skip metering
          }
        }
      }),
      catchError((error) => {
        const clientId = request.clientId;
        if (clientId) {
          const durationMs = Date.now() - startTime;
          const statusCode = error instanceof HttpException ? error.getStatus() : 500;
          const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';

          this.apiAuditService.logCall({
            clientId,
            endpoint: originalUrl,
            method,
            statusCode,
            ipAddress: typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : ipAddress,
            userAgent,
            durationMs,
            errorMessage,
          });
        }
        return throwError(() => error);
      }),
    );
  }
}
