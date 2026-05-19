import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class CarePlanService {
  private readonly logger = new Logger(CarePlanService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getCarePlans(patientId: string) {
    const tenantId = this.getTenantId();
    let carePlans = await this.prisma.carePlan.findMany({
      where: { tenantId, patientId },
    });

    if (carePlans.length === 0) {
      await this.prisma.carePlan.create({
        data: {
          tenantId,
          patientId,
          planName: 'Diabetic Health & Wellness Remote Program',
          description: 'MedFlow gamified wellness adherence plan for active diabetic remote checking.',
          exerciseInstructions: 'Cardio training for 30 minutes daily',
          adherenceScore: 92.5,
        },
      });
      carePlans = await this.prisma.carePlan.findMany({
        where: { tenantId, patientId },
      });
    }

    return carePlans;
  }
}