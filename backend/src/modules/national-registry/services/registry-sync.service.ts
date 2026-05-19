import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class RegistrySyncService {
  private readonly logger = new Logger(RegistrySyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async syncRecord(data: { registryType: string; recordId: string }) {
    const tenantId = this.getTenantId();

    const sync = await this.prisma.nationalRegistrySync.create({
      data: {
        tenantId,
        registryType: data.registryType, // VACCINE, SURVEILLANCE, COMPLIANCE
        recordId: data.recordId,
        status: 'SYNCED',
      },
    });

    return sync;
  }

  async getSyncLogs() {
    const tenantId = this.getTenantId();
    return this.prisma.nationalRegistrySync.findMany({
      where: { tenantId },
      orderBy: { lastSyncAt: 'desc' },
    });
  }
}
