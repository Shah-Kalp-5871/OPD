import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class EligibilityVerificationService {
  private readonly logger = new Logger(EligibilityVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async verifyEligibility(data: any) {
    const tenantId = this.getTenantId();
    
    // Simulate complex real-time health clearinghouse eligibility verification
    const isActive = Math.random() > 0.1; // 90% chance active coverage
    const coPayDetails = {
      primaryCare: isActive ? 20.00 : 0,
      specialist: isActive ? 40.00 : 0,
      emergencyRoom: isActive ? 150.00 : 0,
      deductibleMet: isActive ? 1200.00 : 0,
      outOfPocketMax: isActive ? 5000.00 : 0,
    };

    const check = await this.prisma.eligibilityCheck.create({
      data: {
        tenantId,
        branchId: data.branchId,
        patientId: data.patientId,
        payerId: data.payerId,
        coverageStatus: isActive ? 'ACTIVE' : 'INACTIVE',
        coPayDetails: coPayDetails,
      },
    });

    return check;
  }

  async getChecks() {
    const tenantId = this.getTenantId();
    return this.prisma.eligibilityCheck.findMany({
      where: { tenantId },
      orderBy: { checkedAt: 'desc' },
    });
  }
}
