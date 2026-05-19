import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class HealthIdVerificationService {
  private readonly logger = new Logger(HealthIdVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async verifyCitizenId(data: { healthId: string; verifiedName: string; verificationDoc?: string }) {
    const tenantId = this.getTenantId();

    const verify = await this.prisma.citizenHealthIdVerify.create({
      data: {
        tenantId,
        healthId: data.healthId,
        verifiedName: data.verifiedName,
        verificationDoc: data.verificationDoc,
        status: 'VERIFIED',
      },
    });

    return verify;
  }

  async getVerifications() {
    const tenantId = this.getTenantId();
    return this.prisma.citizenHealthIdVerify.findMany({
      where: { tenantId },
      orderBy: { verifiedAt: 'desc' },
    });
  }
}
