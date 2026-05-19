import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class KnowledgeGraphService {
  private readonly logger = new Logger(KnowledgeGraphService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getGraphData() {
    const tenantId = this.getTenantId();

    let nodes = await this.prisma.knowledgeNode.findMany({ where: { tenantId } });
    let relations = await this.prisma.knowledgeRelation.findMany({ where: { tenantId } });

    if (nodes.length === 0) {
      // Seed default clinical node network
      const defaultNodes = [
        { nodeType: 'DISEASE', conceptCode: 'DIS-01', label: 'Hypertension', description: 'Chronic high blood pressure' },
        { nodeType: 'DISEASE', conceptCode: 'DIS-02', label: 'Hyperkalemia', description: 'Elevated potassium level' },
        { nodeType: 'DRUG', conceptCode: 'DRG-01', label: 'Lisinopril', description: 'ACE inhibitor medication' },
        { nodeType: 'DRUG', conceptCode: 'DRG-02', label: 'Spironolactone', description: 'Potassium-sparing diuretic' },
        { nodeType: 'SYMPTOM', conceptCode: 'SYM-01', label: 'Headache', description: 'Common neurological symptom' },
      ];

      for (const n of defaultNodes) {
        await this.prisma.knowledgeNode.create({
          data: {
            tenantId,
            nodeType: n.nodeType,
            conceptCode: n.conceptCode,
            label: n.label,
            description: n.description,
          },
        });
      }

      const defaultRelations = [
        { sourceNodeCode: 'DRG-01', targetNodeCode: 'DIS-01', relationType: 'TREATS', weight: 0.95 },
        { sourceNodeCode: 'DRG-02', targetNodeCode: 'DIS-01', relationType: 'TREATS', weight: 0.8 },
        { sourceNodeCode: 'DRG-02', targetNodeCode: 'DIS-02', relationType: 'CAUSES', weight: 0.9 },
        { sourceNodeCode: 'DRG-01', targetNodeCode: 'DRG-02', relationType: 'CONTRAINDICATED', weight: 1.0 },
        { sourceNodeCode: 'DIS-01', targetNodeCode: 'SYM-01', relationType: 'CAUSES', weight: 0.6 },
      ];

      for (const r of defaultRelations) {
        await this.prisma.knowledgeRelation.create({
          data: {
            tenantId,
            sourceNodeCode: r.sourceNodeCode,
            targetNodeCode: r.targetNodeCode,
            relationType: r.relationType,
            weight: r.weight,
          },
        });
      }

      nodes = await this.prisma.knowledgeNode.findMany({ where: { tenantId } });
      relations = await this.prisma.knowledgeRelation.findMany({ where: { tenantId } });
    }

    return { nodes, relations };
  }

  async addNode(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.knowledgeNode.create({
      data: {
        tenantId,
        nodeType: data.nodeType,
        conceptCode: data.conceptCode,
        label: data.label,
        description: data.description,
      },
    });
  }

  async addRelation(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.knowledgeRelation.create({
      data: {
        tenantId,
        sourceNodeCode: data.sourceNodeCode,
        targetNodeCode: data.targetNodeCode,
        relationType: data.relationType,
        weight: data.weight || 1.0,
      },
    });
  }
}
