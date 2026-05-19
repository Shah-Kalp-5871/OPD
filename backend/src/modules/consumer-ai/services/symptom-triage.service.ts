import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class SymptomTriageService {
  private readonly logger = new Logger(SymptomTriageService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async assessSymptoms(patientId: string, symptoms: string) {
    const tenantId = this.getTenantId();
    const severity = symptoms.toLowerCase().includes('chest pain') || symptoms.toLowerCase().includes('breathing') ? 'HIGH' : 'LOW';

    return this.prisma.symptomAssessment.create({
      data: {
        tenantId,
        patientId,
        reportedSymptoms: symptoms,
        aiTriageSummary: `Logged ${severity} triage profile. Doctor escalation triggered: ${severity === 'HIGH'}`,
        doctorEscalated: severity === 'HIGH',
      },
    });
  }
}