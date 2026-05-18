import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggingMiddleware } from './logging.middleware';
import { StructuredLogger } from './structured-logger.service';

@Module({
  providers: [StructuredLogger],
  exports: [StructuredLogger],
})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Intercept all routes for HTTP request context correlation mapping
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
