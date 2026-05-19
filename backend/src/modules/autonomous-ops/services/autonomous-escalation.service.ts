import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class AutonomousEscalationService {
  private readonly logger = new Logger(AutonomousEscalationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async createEscalation(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.aiEscalation.create({
      data: {
        tenantId,
        branchId: data.branchId || null,
        issueSummary: data.issueSummary,
        urgency: data.urgency || 'CRITICAL',
        assignedRole: data.assignedRole || 'SUPERADMIN',
        status: 'OPEN',
      },
    });
  }

  async getEscalations() {
    const tenantId = this.getTenantId();
    return this.prisma.aiEscalation.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveEscalation(id: string) {
    const tenantId = this.getTenantId();
    return this.prisma.aiEscalation.updateMany({
      where: { id, tenantId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });
  }
}
