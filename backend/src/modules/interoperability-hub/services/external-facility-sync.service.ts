import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class ExternalFacilitySyncService {
  private readonly logger = new Logger(ExternalFacilitySyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async createConnection(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.externalFacilityConnection.create({
      data: {
        tenantId,
        facilityName: data.facilityName,
        connectionType: data.connectionType, // FHIR_API, HL7_TCP, SFTP
        endpoint: data.endpoint,
        authToken: data.authToken,
        isActive: data.isActive ?? true,
      },
    });
  }

  async getConnections() {
    const tenantId = this.getTenantId();
    return this.prisma.externalFacilityConnection.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async syncResources(data: any) {
    const tenantId = this.getTenantId();
    const sync = await this.prisma.fhirResourceSync.create({
      data: {
        tenantId,
        resourceType: data.resourceType,
        externalId: data.externalId,
        localId: data.localId,
        direction: data.direction, // PUSH, PULL
        lastSyncAt: new Date(),
      },
    });

    return sync;
  }

  async getSyncs() {
    const tenantId = this.getTenantId();
    return this.prisma.fhirResourceSync.findMany({
      where: { tenantId },
      orderBy: { lastSyncAt: 'desc' },
    });
  }
}
