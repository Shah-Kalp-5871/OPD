import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class RegionalComplianceEngine {
  private readonly logger = new Logger(RegionalComplianceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async saveConsent(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.crossBorderConsent.create({
      data: {
        tenantId,
        patientId: data.patientId,
        targetCountry: data.targetCountry,
        consentGiven: data.consentGiven ?? true,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
  }

  async getConsents() {
    const tenantId = this.getTenantId();
    return this.prisma.crossBorderConsent.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async logDataResidencyAudit(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.dataResidencyAudit.create({
      data: {
        tenantId,
        region: data.region, // US, EU, CA, AS
        actionType: data.actionType, // ACCESS, EXPORT, TRANSIT
        phiType: data.phiType,
        auditedBy: data.auditedBy || 'SYSTEM_AUDITOR',
      },
    });
  }

  async getResidencyAudits() {
    const tenantId = this.getTenantId();
    return this.prisma.dataResidencyAudit.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
