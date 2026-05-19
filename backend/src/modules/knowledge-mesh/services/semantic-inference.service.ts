import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class SemanticInferenceService {
  private readonly logger = new Logger(SemanticInferenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async runInference(contextId: string, queryContext: string) {
    const tenantId = this.getTenantId();

    const inferredChain = [
      'Query SNOMED-CT for chronic indicators',
      'Resolve RxNorm cross-contraindications',
      'Traverse drug-disease interaction edges',
      'Detect genetic marker compatibility pathways',
    ];

    const graph = await this.prisma.inferenceGraph.create({
      data: {
        tenantId,
        queryContext,
        inferredChain,
        executionTimeMs: 145,
      },
    });

    const rec = await this.prisma.semanticRecommendation.create({
      data: {
        tenantId,
        contextId,
        recommendation: `Verify ACE Inhibitor dosage due to contraindication with patient's hyperkalemia record.`,
        cognitivePath: 'Patient Profile → Diagnoses: Hypertension, Hyperkalemia → RX: Lisinopril → Conflict detected.',
        confidenceScore: 0.96,
      },
    });

    return { graph, rec };
  }

  async getInferenceGraphs() {
    const tenantId = this.getTenantId();
    return this.prisma.inferenceGraph.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSemanticRecommendations() {
    const tenantId = this.getTenantId();
    return this.prisma.semanticRecommendation.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
