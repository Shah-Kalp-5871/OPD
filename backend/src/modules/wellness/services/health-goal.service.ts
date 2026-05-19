import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class HealthGoalService {
  private readonly logger = new Logger(HealthGoalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getGoals(patientId: string) {
    const tenantId = this.getTenantId();
    let goals = await this.prisma.healthGoal.findMany({
      where: { tenantId, patientId },
    });

    if (goals.length === 0) {
      await this.prisma.healthGoal.create({
        data: {
          tenantId,
          patientId,
          goalType: 'Daily Steps Tracker',
          targetValue: 10000,
          currentValue: 8420,
          unit: 'steps',
          status: 'IN_PROGRESS',
        },
      });
      goals = await this.prisma.healthGoal.findMany({
        where: { tenantId, patientId },
      });
    }

    return goals;
  }

  async logGoalProgress(patientId: string, goalType: string, progress: number) {
    const tenantId = this.getTenantId();
    return this.prisma.healthGoal.updateMany({
      where: { tenantId, patientId, goalType },
      data: { currentValue: progress, status: progress >= 10000 ? 'COMPLETED' : 'IN_PROGRESS' },
    });
  }
}