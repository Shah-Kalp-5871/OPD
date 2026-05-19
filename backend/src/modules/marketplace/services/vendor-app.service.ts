import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class VendorAppService {
  private readonly logger = new Logger(VendorAppService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async installApp(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.marketplaceApp.create({
      data: {
        tenantId,
        appName: data.appName,
        developer: data.developer,
        category: data.category,
        price: data.price,
        isSubscribed: true,
        installedAt: new Date(),
      },
    });
  }

  async getInstalledApps() {
    const tenantId = this.getTenantId();
    return this.prisma.marketplaceApp.findMany({
      where: { tenantId, isSubscribed: true },
      include: { reviews: true },
    });
  }

  async getMarketplaceApps() {
    const tenantId = this.getTenantId();
    return this.prisma.marketplaceApp.findMany({
      where: { tenantId },
      include: { reviews: true },
    });
  }
}
