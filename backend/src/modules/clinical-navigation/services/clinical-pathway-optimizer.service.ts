import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class ClinicalPathwayOptimizerService {
  private readonly logger = new Logger(ClinicalPathwayOptimizerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getRecommendations(patientId?: string) {
    const tenantId = this.getTenantId();
    let recs = await this.prisma.navigationRecommendation.findMany({
      where: {
        tenantId,
        patientId: patientId ? patientId : undefined,
        isDismissed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recs.length === 0 && patientId) {
      // Create seed recommendations
      const defaults = [
        { suggestedStep: 'Schedule Telehealth Check-In', clinicalBasis: 'Patient has reported minor blood pressure fluctuations in wearable log.', priority: 'URGENT' },
        { suggestedStep: 'Automated Pharmacy Refill Alert', clinicalBasis: 'Beta-blocker prescription count ends in 3 days.', priority: 'ROUTINE' },
        { suggestedStep: 'Recommend Diabetic Nutrition Class', clinicalBasis: 'Patient diagnosed with Type-2 diabetes and shows fluctuating fasting glucose.', priority: 'ROUTINE' },
      ];

      for (const item of defaults) {
        const rec = await this.prisma.navigationRecommendation.create({
          data: {
            tenantId,
            patientId,
            suggestedStep: item.suggestedStep,
            clinicalBasis: item.clinicalBasis,
            priority: item.priority,
          },
        });
        recs.push(rec);
      }
    }

    return recs;
  }

  async dismissRecommendation(id: string) {
    const tenantId = this.getTenantId();
    return this.prisma.navigationRecommendation.updateMany({
      where: { id, tenantId },
      data: { isDismissed: true },
    });
  }
}
