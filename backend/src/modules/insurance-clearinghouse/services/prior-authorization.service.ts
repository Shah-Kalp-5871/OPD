import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class PriorAuthorizationService {
  private readonly logger = new Logger(PriorAuthorizationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async requestAuthorization(data: any) {
    const tenantId = this.getTenantId();
    const priorAuth = await this.prisma.priorAuthorization.create({
      data: {
        tenantId,
        branchId: data.branchId,
        patientId: data.patientId,
        payerId: data.payerId,
        authNumber: data.authNumber || `PA-${Date.now()}`,
        requestType: data.requestType,
        status: 'PENDING',
        clinicalNotes: data.clinicalNotes,
        approvedCodes: data.approvedCodes || [],
      },
    });

    return priorAuth;
  }

  async getAuthorizations() {
    const tenantId = this.getTenantId();
    return this.prisma.priorAuthorization.findMany({
      where: { tenantId },
      orderBy: { requestedDate: 'desc' },
    });
  }

  async decideAuthorization(authId: string, data: any) {
    const tenantId = this.getTenantId();
    
    return this.prisma.priorAuthorization.update({
      where: { id: authId },
      data: {
        status: data.status, // APPROVED, DENIED
        decidedDate: new Date(),
        validUntil: data.validUntil ? new Date(data.validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // default 30 days valid
        approvedCodes: data.approvedCodes,
      },
    });
  }
}
