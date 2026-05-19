import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class CareJourneyService {
  private readonly logger = new Logger(CareJourneyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async createJourney(data: any) {
    const tenantId = this.getTenantId();
    const journey = await this.prisma.careJourney.create({
      data: {
        tenantId,
        branchId: data.branchId || null,
        patientId: data.patientId,
        conditionName: data.conditionName,
        currentStage: data.currentStage || 'INTAKE',
        predictedRisk: data.predictedRisk || 'LOW',
        progressPct: data.progressPct || 0.0,
      },
    });

    if (data.milestones && data.milestones.length > 0) {
      for (const m of data.milestones) {
        await this.prisma.careMilestone.create({
          data: {
            tenantId,
            journeyId: journey.id,
            title: m.title,
            status: m.status || 'PENDING',
            targetDate: m.targetDate ? new Date(m.targetDate) : null,
          },
        });
      }
    }

    return journey;
  }

  async getJourneys(patientId?: string) {
    const tenantId = this.getTenantId();
    return this.prisma.careJourney.findMany({
      where: {
        tenantId,
        patientId: patientId ? patientId : undefined,
      },
      include: { milestones: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateJourneyStage(id: string, stage: string, progressPct: number) {
    const tenantId = this.getTenantId();
    return this.prisma.careJourney.updateMany({
      where: { id, tenantId },
      data: {
        currentStage: stage,
        progressPct,
      },
    });
  }

  async completeMilestone(milestoneId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.careMilestone.updateMany({
      where: { id: milestoneId, tenantId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }
}
