import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisCacheModule } from '../../common/cache/redis-cache.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { SaasBillingController } from './controllers/saas-billing.controller';
import { SaasBillingService } from './services/saas-billing.service';
import { StripeService } from './services/stripe.service';

@Module({
  imports: [
    PrismaModule,
    RedisCacheModule,
    TenancyModule,
  ],
  controllers: [SaasBillingController],
  providers: [
    SaasBillingService,
    StripeService,
  ],
  exports: [
    SaasBillingService,
    StripeService,
  ],
})
export class SaasBillingModule {}
