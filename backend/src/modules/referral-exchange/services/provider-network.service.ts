import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class ProviderNetworkService {
  private readonly logger = new Logger(ProviderNetworkService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async addSpecialist(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.providerNetworkSpecialist.create({
      data: {
        tenantId,
        specialistName: data.specialistName,
        specialty: data.specialty,
        facilityName: data.facilityName,
        contactInfo: data.contactInfo,
        rating: data.rating || 5.0,
      },
    });
  }

  async getSpecialists() {
    const tenantId = this.getTenantId();
    return this.prisma.providerNetworkSpecialist.findMany({
      where: { tenantId },
      orderBy: { rating: 'desc' },
    });
  }
}
