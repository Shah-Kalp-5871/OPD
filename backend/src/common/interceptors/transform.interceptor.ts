import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data has both data and meta, don't unwrap the inner data
        // because we need both for pagination.
        const shouldUnwrap = data?.data && !data?.meta;

        return {
          success: true,
          data: shouldUnwrap ? data.data : data,
          message: data?.message || 'Request successful',
        };
      }),
    );
  }
}
