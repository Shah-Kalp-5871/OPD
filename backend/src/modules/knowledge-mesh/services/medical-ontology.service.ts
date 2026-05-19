import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class MedicalOntologyService {
  private readonly logger = new Logger(MedicalOntologyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getOntologies() {
    const tenantId = this.getTenantId();
    let ontologies = await this.prisma.clinicalOntology.findMany({
      where: { tenantId },
    });

    if (ontologies.length === 0) {
      const defaults = [
        { domainName: 'CARDIOLOGY', rulesCount: 142, version: '1.2.0' },
        { domainName: 'ONCOLOGY', rulesCount: 89, version: '2.0.1' },
        { domainName: 'PEDIATRICS', rulesCount: 64, version: '1.0.5' },
        { domainName: 'INFECTIOUS_DISEASES', rulesCount: 110, version: '3.1.0' },
      ];

      for (const item of defaults) {
        const ont = await this.prisma.clinicalOntology.create({
          data: {
            tenantId,
            domainName: item.domainName,
            rulesCount: item.rulesCount,
            version: item.version,
            isActive: true,
          },
        });
        ontologies.push(ont);
      }
    }

    return ontologies;
  }

  async toggleOntology(id: string, active: boolean) {
    const tenantId = this.getTenantId();
    return this.prisma.clinicalOntology.updateMany({
      where: { id, tenantId },
      data: { isActive: active },
    });
  }
}
