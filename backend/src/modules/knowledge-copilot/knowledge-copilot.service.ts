import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class KnowledgeCopilotService {
  private readonly logger = new Logger(KnowledgeCopilotService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  async askQuestion(userId: string, query: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log(`Copilot query received from user ${userId}: ${query}`);

    // Simulated RAG process
    const simulatedResponse = `Based on the latest clinical protocols, the recommended first-line treatment for the described condition includes standard ABC therapy. Please refer to Document XYZ for dosage guidelines.`;
    const citations = [
      { docId: 'doc-101', title: 'Standard Treatment Guidelines 2026' },
      { docId: 'doc-102', title: 'Internal Policy: Antibiotic Stewardship' }
    ];

    const interaction = await this.prisma.copilotInteraction.create({
      data: {
        tenantId,
        userId,
        query,
        response: simulatedResponse,
        citations,
      }
    });

    return interaction;
  }

  async uploadDocument(title: string, content: string, category: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const doc = await this.prisma.ragDocument.create({
      data: {
        tenantId,
        title,
        content,
        category,
        vectorId: `vec-${Date.now()}` // Simulated vector insertion
      }
    });

    this.logger.log(`Document ${title} ingested into Copilot RAG.`);
    return doc;
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    
    const recentQueries = await this.prisma.copilotInteraction.findMany({
      where: { tenantId },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    const docCount = await this.prisma.ragDocument.count({
      where: { tenantId }
    });

    return { recentQueries, docCount };
  }
}
