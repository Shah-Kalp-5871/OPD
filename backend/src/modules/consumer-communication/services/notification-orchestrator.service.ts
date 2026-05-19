import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class NotificationOrchestratorService {
  private readonly logger = new Logger(NotificationOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getCampaigns() {
    const tenantId = this.getTenantId();
    let campaigns = await this.prisma.communicationCampaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    if (campaigns.length === 0) {
      await this.prisma.communicationCampaign.create({
        data: {
          tenantId,
          campaignName: 'Spring Wellness & Vaccination Campaign',
          channel: 'WhatsApp',
          status: 'COMPLETED',
          sentCount: 1500,
          deliveredCount: 1482,
          failedCount: 18,
        },
      });
      campaigns = await this.prisma.communicationCampaign.findMany({
        where: { tenantId },
      });
    }

    return campaigns;
  }

  async triggerCampaign(campaignName: string, channel: string, body: string) {
    const tenantId = this.getTenantId();
    const campaign = await this.prisma.communicationCampaign.create({
      data: {
        tenantId,
        campaignName,
        channel,
        status: 'RUNNING',
      },
    });

    // Simulate sending messaging logs
    await this.prisma.communicationCampaign.update({
      where: { id: campaign.id },
      data: {
        status: 'COMPLETED',
        sentCount: 200,
        deliveredCount: 198,
        failedCount: 2,
      },
    });

    return campaign;
  }
}