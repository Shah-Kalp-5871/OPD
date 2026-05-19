import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class SentimentAnalysisService {
  private readonly logger = new Logger(SentimentAnalysisService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async fileIncident(patientId: string, complaintText: string) {
    const tenantId = this.getTenantId();
    return this.prisma.experienceIncident.create({
      data: {
        tenantId,
        patientId,
        complaintText,
        severity: 'MEDIUM',
        status: 'OPEN',
      },
    });
  }

  async getIncidents() {
    const tenantId = this.getTenantId();
    return this.prisma.experienceIncident.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}