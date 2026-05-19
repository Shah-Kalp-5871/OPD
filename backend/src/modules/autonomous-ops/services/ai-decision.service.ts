import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class AiDecisionService {
  private readonly logger = new Logger(AiDecisionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async createDecision(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.autonomousDecision.create({
      data: {
        tenantId,
        branchId: data.branchId || null,
        decisionType: data.decisionType,
        rationale: data.rationale,
        confidenceScore: data.confidenceScore,
        evidence: data.evidence || {},
        status: 'PENDING',
      },
    });
  }

  async getDecisions(status?: string) {
    const tenantId = this.getTenantId();
    return this.prisma.autonomousDecision.findMany({
      where: {
        tenantId,
        status: status ? status : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async decideAction(id: string, action: 'APPROVED' | 'REJECTED', userId?: string) {
    const tenantId = this.getTenantId();
    const decision = await this.prisma.autonomousDecision.findFirst({
      where: { id, tenantId },
    });

    if (!decision) {
      throw new Error('Decision entry not found');
    }

    const updated = await this.prisma.autonomousDecision.update({
      where: { id },
      data: {
        status: action === 'APPROVED' ? 'EXECUTED' : 'REJECTED',
        actionedBy: userId || 'CLINICAL_COMMANDER',
        actionedAt: new Date(),
      },
    });

    // If approved, create AiOperationalDirective
    if (action === 'APPROVED') {
      await this.prisma.aiOperationalDirective.create({
        data: {
          tenantId,
          branchId: decision.branchId,
          directive: `AUTONOMOUS_ACTIVATE: ${decision.decisionType} - ${decision.rationale}`,
          targetDept: 'EMERGENCY_DEPT',
          priority: 'HIGH',
          status: 'ACTIVE',
        },
      });
    }

    return updated;
  }

  async getDirectives() {
    const tenantId = this.getTenantId();
    return this.prisma.aiOperationalDirective.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
