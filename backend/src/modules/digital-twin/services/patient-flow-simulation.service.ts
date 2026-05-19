import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class PatientFlowSimulationService {
  private readonly logger = new Logger(PatientFlowSimulationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getEvents() {
    const tenantId = this.getTenantId();
    return this.prisma.twinEvent.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getRecommendations() {
    const tenantId = this.getTenantId();
    return this.prisma.twinRecommendation.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async applyRecommendation(id: string) {
    const tenantId = this.getTenantId();
    return this.prisma.twinRecommendation.updateMany({
      where: { id, tenantId },
      data: { isApplied: true },
    });
  }
}
