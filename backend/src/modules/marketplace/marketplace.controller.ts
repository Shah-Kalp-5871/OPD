import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { VendorAppService } from './services/vendor-app.service';
import { PartnerBillingService } from './services/partner-billing.service';
import { MarketplaceReviewService } from './services/marketplace-review.service';

@Controller('marketplace')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MarketplaceController {
  constructor(
    private readonly appService: VendorAppService,
    private readonly billingService: PartnerBillingService,
    private readonly reviewService: MarketplaceReviewService,
  ) {}

  @Get('apps')
  async getMarketplaceApps() {
    return this.appService.getMarketplaceApps();
  }

  @Get('apps/installed')
  async getInstalledApps() {
    return this.appService.getInstalledApps();
  }

  @Post('apps/install')
  async installApp(@Body() data: any) {
    return this.appService.installApp(data);
  }

  @Get('billing/invoices')
  async getInvoices() {
    return this.billingService.getInvoices();
  }

  @Post('billing/invoices')
  async createInvoice(@Body() data: any) {
    return this.billingService.createInvoice(data);
  }

  @Post('billing/invoices/:id/pay')
  async payInvoice(@Param('id') id: string) {
    return this.billingService.payInvoice(id);
  }

  @Post('reviews')
  async leaveReview(@Body() data: any) {
    return this.reviewService.leaveReview(data);
  }
}
