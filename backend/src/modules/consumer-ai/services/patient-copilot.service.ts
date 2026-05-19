import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class PatientCopilotService {
  private readonly logger = new Logger(PatientCopilotService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async askCopilot(patientId: string, prompt: string) {
    const tenantId = this.getTenantId();
    
    // Simulate AI model response workflow
    const answersMap: Record<string, string> = {
      'headache': 'A mild headache might be related to fatigue or hydration issues. Ensure rest and fluid intake.',
      'fever': 'A temperature above 98.6Â°F should be monitored. Consult a physician if it goes beyond 101Â°F.',
      'medication': 'MedFlow smart assistant warns to always check container signatures before taking pharmacy scripts.',
    };

    const searchKeyword = prompt.toLowerCase();
    let responseText = 'Your symptoms have been logged. I recommend discussing this with a clinical advisor.';
    
    for (const [key, value] of Object.entries(answersMap)) {
      if (searchKeyword.includes(key)) {
        responseText = value;
        break;
      }
    }

    const rec = await this.prisma.consumerAiRecommendation.create({
      data: {
        tenantId,
        patientId,
        recommendationText: responseText,
        sourceType: 'PATIENT_COPILOT',
      },
    });

    return { response: responseText, recommendation: rec };
  }
}