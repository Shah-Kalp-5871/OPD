import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { MetricsModule } from '../metrics/metrics.module';
import { TenancyModule } from '../modules/tenancy/tenancy.module';
import { AuthModule } from '../auth/auth.module';

import { ApiKeyService } from './auth/api-key.service';
import { OAuthService } from './auth/oauth.service';
import { RateLimitService } from './rate-limit/rate-limit.service';
import { PublicWebhookService } from './webhooks/public-webhook.service';
import { WebhookProcessor } from './webhooks/webhook.processor';
import { WebhookCatalogService } from './webhooks/webhook-catalog.service';
import { ApiAuditService } from './audit/api-audit.service';
import { PublicApiScopeService } from './scope/public-api-scope.service';
import { ApiUsageService } from './usage/api-usage.service';
import { ApiClientAdminService } from './admin/api-client-admin.service';

import { OAuthController } from './auth/oauth.controller';
import { PublicWebhookController } from './webhooks/public-webhook.controller';
import { WebhookRegistryController, WebhookAdminController } from './webhooks/webhook-registry.controller';
import { PublicAppointmentsController } from './endpoints/public-appointments.controller';
import { PublicPatientsController } from './endpoints/public-patients.controller';
import { ApiClientAdminController } from './admin/api-client-admin.controller';
import { ApiUsageController } from './usage/api-usage.controller';
import { PublicApiDocsController } from './docs/public-api-docs.controller';

import { ApiAuditInterceptor } from './audit/api-audit.interceptor';
import { ApiMetricsInterceptor } from './metrics/api-metrics.interceptor';
import { RateLimitGuard } from './rate-limit/rate-limit.guard';
import { ApiKeyGuard } from './auth/api-key.guard';
import { ApiQuotaGuard } from './usage/api-quota.guard';

@Module({
  imports: [
    PrismaModule,
    MetricsModule,
    TenancyModule,
    AuthModule,
    BullModule.registerQueue({ name: 'webhooks' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'medflow-developer-jwt-key-2026',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    OAuthController,
    PublicWebhookController,
    WebhookRegistryController,
    WebhookAdminController,
    PublicAppointmentsController,
    PublicPatientsController,
    ApiClientAdminController,
    ApiUsageController,
    PublicApiDocsController,
  ],
  providers: [
    ApiKeyService,
    OAuthService,
    RateLimitService,
    PublicWebhookService,
    WebhookCatalogService,
    WebhookProcessor,
    ApiAuditService,
    PublicApiScopeService,
    ApiUsageService,
    ApiClientAdminService,
    RateLimitGuard,
    ApiKeyGuard,
    ApiQuotaGuard,
    ApiAuditInterceptor,
    ApiMetricsInterceptor,
  ],
  exports: [
    ApiKeyService,
    OAuthService,
    RateLimitService,
    PublicWebhookService,
    WebhookCatalogService,
    ApiAuditService,
    PublicApiScopeService,
    ApiUsageService,
    ApiKeyGuard,
    RateLimitGuard,
  ],
})
export class PublicApiModule {}
