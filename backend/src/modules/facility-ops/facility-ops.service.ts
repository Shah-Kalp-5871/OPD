import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class FacilityOpsService {
  private readonly logger = new Logger(FacilityOpsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async createFacility(data: { name: string; type: string; floor?: string; capacity?: number; branchId?: string }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.facility.create({ data: { tenantId, ...data } });
  }

  async createTicket(data: { facilityId: string; title: string; description?: string; priority?: string; assignedTo?: string }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    const slaDeadline = new Date(Date.now() + (data.priority === 'CRITICAL' ? 4 : data.priority === 'HIGH' ? 24 : 72) * 3_600_000);
    return this.prisma.maintenanceTicket.create({ data: { tenantId, slaDeadline, ...data } });
  }

  async resolveTicket(id: string, cost?: number) {
    return this.prisma.maintenanceTicket.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedAt: new Date(), cost },
    });
  }

  async recordEnergy(data: { facilityId: string; metricType: string; value: number; unit: string }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    const anomaly = data.value > 1000;
    return this.prisma.energyConsumption.create({ data: { tenantId, anomaly, ...data } });
  }

  async fileIncident(data: {
    title: string;
    description: string;
    incidentType: string;
    severity?: string;
    location?: string;
    reportedBy: string;
    branchId?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    this.logger.warn(`Incident reported: ${data.title} — ${data.severity}`);
    return this.prisma.incidentReport.create({ data: { tenantId, ...data } });
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const [openTickets, criticalTickets, openIncidents, energyAnomalies] = await Promise.all([
      this.prisma.maintenanceTicket.count({ where: { tenantId, status: 'OPEN' } }),
      this.prisma.maintenanceTicket.count({ where: { tenantId, priority: 'CRITICAL', status: { not: 'RESOLVED' } } }),
      this.prisma.incidentReport.count({ where: { tenantId, status: 'OPEN' } }),
      this.prisma.energyConsumption.count({ where: { tenantId, anomaly: true } }),
    ]);

    const recentTickets = await this.prisma.maintenanceTicket.findMany({
      where: { tenantId },
      include: { facility: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return { openTickets, criticalTickets, openIncidents, energyAnomalies, recentTickets };
  }
}
