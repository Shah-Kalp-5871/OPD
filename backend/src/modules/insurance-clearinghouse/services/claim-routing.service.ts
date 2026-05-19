import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class ClaimRoutingService {
  private readonly logger = new Logger(ClaimRoutingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async submitClaim(data: any) {
    const tenantId = this.getTenantId();
    const claim = await this.prisma.insuranceClaim.create({
      data: {
        tenantId,
        branchId: data.branchId,
        patientId: data.patientId,
        payerId: data.payerId,
        claimNumber: data.claimNumber || `CLM-${Date.now()}`,
        status: 'SUBMITTED',
        totalAmount: data.totalAmount,
        submittedAt: new Date(),
        lineItems: {
          create: data.lineItems?.map((item: any) => ({
            tenantId,
            serviceCode: item.serviceCode,
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice,
            totalAmount: item.totalAmount,
          })),
        },
      },
      include: {
        lineItems: true,
      },
    });

    await this.prisma.claimAuditTrail.create({
      data: {
        tenantId,
        claimId: claim.id,
        actionType: 'SUBMIT',
        performedBy: data.userId || 'SYSTEM',
        newStatus: 'SUBMITTED',
        notes: 'Claim created and submitted to clearinghouse.',
      },
    });

    return claim;
  }

  async getClaims(status?: string) {
    const tenantId = this.getTenantId();
    return this.prisma.insuranceClaim.findMany({
      where: {
        tenantId,
        status: status ? status : undefined,
      },
      include: {
        lineItems: true,
        auditTrails: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async processClaim(claimId: string, data: any) {
    const tenantId = this.getTenantId();
    const claim = await this.prisma.insuranceClaim.findFirst({
      where: { id: claimId, tenantId },
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    const updatedClaim = await this.prisma.insuranceClaim.update({
      where: { id: claimId },
      data: {
        status: data.status, // PAID, DENIED, REJECTED
        paidAmount: data.paidAmount,
        rejectionReason: data.rejectionReason,
        processedAt: new Date(),
      },
    });

    await this.prisma.claimAuditTrail.create({
      data: {
        tenantId,
        claimId,
        actionType: data.status === 'PAID' ? 'PAID' : 'REJECT',
        performedBy: data.userId || 'PAYER_CLEARINGHOUSE',
        previousStatus: claim.status,
        newStatus: data.status,
        notes: data.notes || `Processed by clearinghouse with status ${data.status}`,
      },
    });

    return updatedClaim;
  }
}
