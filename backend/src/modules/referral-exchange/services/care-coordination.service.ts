import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class CareCoordinationService {
  private readonly logger = new Logger(CareCoordinationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async sendReferral(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.crossHospitalReferral.create({
      data: {
        tenantId,
        patientId: data.patientId,
        targetFacility: data.targetFacility,
        specialty: data.specialty,
        referralReason: data.referralReason,
        status: 'PENDING',
      },
    });
  }

  async getReferrals() {
    const tenantId = this.getTenantId();
    return this.prisma.crossHospitalReferral.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReferralStatus(referralId: string, status: string) {
    const tenantId = this.getTenantId();
    return this.prisma.crossHospitalReferral.update({
      where: { id: referralId },
      data: { status },
    });
  }

  async createSharedCare(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.sharedCareCoordination.create({
      data: {
        tenantId,
        patientId: data.patientId,
        providerNodes: data.providerNodes || [],
        sharedDataTypes: data.sharedDataTypes || [],
      },
    });
  }

  async getSharedCares() {
    const tenantId = this.getTenantId();
    return this.prisma.sharedCareCoordination.findMany({
      where: { tenantId },
      orderBy: { lastActivityAt: 'desc' },
    });
  }
}
