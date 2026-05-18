import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { Request, Response, NextFunction } from 'express';
import { RedisIoAdapter } from './socket/redis-io.adapter';
import { StructuredLogger } from './common/logging/structured-logger.service';

// BigInt Serialization Fix for JSON.stringify
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const logger = new StructuredLogger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  const configService = app.get(ConfigService);
  const frontendOrigin = configService.get('CORS_ORIGIN') || 'http://localhost:3000';

  // Enable Graceful Container Shutdown hooks
  app.enableShutdownHooks();

  const redisIoAdapter = new RedisIoAdapter(app);
  app.useWebSocketAdapter(redisIoAdapter);

  // Security Hardening
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: [
            "'self'",
            "wss:",
            "ws:",
            "https://api.stripe.com",
            frontendOrigin,
          ],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      xFrameOptions: { action: "deny" },
    }),
  );
  app.use(compression());

  // Correlation ID Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const correlationId =
      req.headers['x-correlation-id'] || crypto.randomUUID();
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
  });

  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global Interceptors & Filters
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter(configService));

  // Strict Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 400,
    }),
  );

  const port = configService.get('PORT');
  await app.listen(port);
  logger.log(
    `MedFlow API running on port: ${port} [${configService.get('NODE_ENV')}]`,
  );
  logger.log(`CORS allowed for: ${frontendOrigin}`);
}
bootstrap();
