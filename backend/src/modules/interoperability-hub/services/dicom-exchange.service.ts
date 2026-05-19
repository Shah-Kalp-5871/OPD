import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class DicomExchangeService {
  private readonly logger = new Logger(DicomExchangeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async routeDicomStudy(data: { studyInstanceUid: string; modality: string; externalNode: string }) {
    const tenantId = this.getTenantId();
    
    const log = await this.prisma.dicomRouteLog.create({
      data: {
        tenantId,
        studyInstanceUid: data.studyInstanceUid,
        modality: data.modality,
        externalNode: data.externalNode,
        status: 'TRANSFERRED',
      },
    });

    return log;
  }

  async getRouteLogs() {
    const tenantId = this.getTenantId();
    return this.prisma.dicomRouteLog.findMany({
      where: { tenantId },
      orderBy: { transferredAt: 'desc' },
    });
  }
}
