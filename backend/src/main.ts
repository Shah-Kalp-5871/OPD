import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const frontendOrigin =
    process.env.FRONTEND_ORIGIN ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000';
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global Interceptors & Filters
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Strict Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 400,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Backend running on: http://localhost:${port}`);
}
bootstrap();
