import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TenancyModule } from '../tenancy/tenancy.module';
import { VendorAppService } from './services/vendor-app.service';
import { PartnerBillingService } from './services/partner-billing.service';
import { MarketplaceReviewService } from './services/marketplace-review.service';
import { MarketplaceController } from './marketplace.controller';

@Module({
  imports: [PrismaModule, TenancyModule],
  providers: [VendorAppService, PartnerBillingService, MarketplaceReviewService],
  controllers: [MarketplaceController],
  exports: [VendorAppService, PartnerBillingService, MarketplaceReviewService],
})
export class MarketplaceModule {}
