import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisCacheModule } from '../../common/cache/redis-cache.module';
import { TenantContextService } from './tenant-context.service';
import { TenantResolverMiddleware } from './tenant-resolver.middleware';
import { TenantGuard } from './guards/tenant.guard';
import { TenantAuditService } from './services/tenant-audit.service';
import { TenantOnboardingService } from './services/tenant-onboarding.service';
import { TenantOnboardingProcessor } from './processors/tenant-onboarding.processor';
import { TenantController } from './controllers/tenant.controller';

@Module({
  imports: [
    PrismaModule,
    RedisCacheModule,
    BullModule.registerQueue({
      name: 'tenant-onboarding',
    }),
  ],
  controllers: [TenantController],
  providers: [
    TenantContextService,
    TenantAuditService,
    TenantOnboardingService,
    TenantOnboardingProcessor,
    TenantGuard,
  ],
  exports: [TenantContextService, TenantGuard, TenantOnboardingService, TenantAuditService],
})
export class TenancyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantResolverMiddleware)
      .exclude(
        { path: 'api/v2/tenants/onboarding', method: RequestMethod.POST },
        { path: 'health', method: RequestMethod.GET },
        { path: 'metrics', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
