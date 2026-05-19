import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class MarketplaceReviewService {
  private readonly logger = new Logger(MarketplaceReviewService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async leaveReview(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.marketplaceReview.create({
      data: {
        tenantId,
        appId: data.appId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }
}
