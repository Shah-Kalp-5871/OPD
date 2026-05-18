import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TelemetryService } from '../../metrics/telemetry.service';

@Injectable()
export class ApiMetricsInterceptor implements NestInterceptor {
  constructor(private readonly telemetryService: TelemetryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { originalUrl } = request;

    // Increment public API request counter
    this.telemetryService.incrementPublicApiRequests(originalUrl);

    return next.handle().pipe(
      catchError((error) => {
        // Increment rate-limiting failures if 429 occurs
        const isRateLimited = 
          error instanceof HttpException && 
          error.getStatus() === HttpStatus.TOO_MANY_REQUESTS;

        if (isRateLimited) {
          this.telemetryService.incrementPublicApiRateLimited();
        }

        return throwError(() => error);
      }),
    );
  }
}
