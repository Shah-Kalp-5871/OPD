import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class BiomedicalService {
  private readonly logger = new Logger(BiomedicalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async registerAsset(data: {
    assetTag: string;
    name: string;
    category: string;
    manufacturer?: string;
    location?: string;
    branchId?: string;
    warrantyExpiry?: Date;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.biomedicalAsset.create({ data: { tenantId, ...data } });
  }

  async scheduleMaintenance(data: {
    assetId: string;
    type: string;
    performedBy?: string;
    cost?: number;
    description?: string;
    nextDue?: Date;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    const maintenance = await this.prisma.assetMaintenance.create({ data: { tenantId, ...data } });
    await this.prisma.biomedicalAsset.update({
      where: { id: data.assetId },
      data: { lastServiceDate: new Date(), nextServiceDue: data.nextDue, status: 'OPERATIONAL' },
    });
    return maintenance;
  }

  async recordDowntime(data: { assetId: string; reason: string; startedAt: Date; impact?: string }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    await this.prisma.biomedicalAsset.update({ where: { id: data.assetId }, data: { status: 'UNDER_MAINTENANCE' } });
    return this.prisma.assetDowntime.create({ data: { tenantId, ...data } });
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const [total, operational, underMaintenance, faulty] = await Promise.all([
      this.prisma.biomedicalAsset.count({ where: { tenantId } }),
      this.prisma.biomedicalAsset.count({ where: { tenantId, status: 'OPERATIONAL' } }),
      this.prisma.biomedicalAsset.count({ where: { tenantId, status: 'UNDER_MAINTENANCE' } }),
      this.prisma.biomedicalAsset.count({ where: { tenantId, status: 'FAULTY' } }),
    ]);

    const recentDowntimes = await this.prisma.assetDowntime.findMany({
      where: { tenantId },
      include: { asset: true },
      orderBy: { startedAt: 'desc' },
      take: 10,
    });

    return { total, operational, underMaintenance, faulty, recentDowntimes };
  }
}
