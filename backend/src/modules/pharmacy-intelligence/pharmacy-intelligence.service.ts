import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class PharmacyIntelligenceService {
  private readonly logger = new Logger(PharmacyIntelligenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async addMedicationInventory(data: {
    medicationName: string;
    genericName?: string;
    category?: string;
    strength?: string;
    unit?: string;
    reorderQty?: number;
    isControlled?: boolean;
    branchId?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.medicationInventory.create({ data: { tenantId, ...data } });
  }

  async addBatch(data: {
    medicationId: string;
    batchNumber: string;
    quantity: number;
    expiryDate: Date;
    manufacturedBy?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const batch = await this.prisma.medicationBatch.create({ data: { tenantId, ...data } });

    // Auto-generate expiry alert if within 90 days
    const daysRemaining = Math.floor((data.expiryDate.getTime() - Date.now()) / 86_400_000);
    if (daysRemaining <= 90) {
      await this.prisma.expiryAlert.create({
        data: {
          tenantId,
          medicationId: data.medicationId,
          batchId: batch.id,
          expiryDate: data.expiryDate,
          daysRemaining,
          alertLevel: daysRemaining <= 30 ? 'CRITICAL' : 'WARNING',
        },
      });
    }

    return batch;
  }

  async recordDispense(data: {
    medicationId: string;
    quantity: number;
    dispensedTo?: string;
    dispensedBy: string;
    prescriptionId?: string;
  }) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    // Anomaly detection: flag quantities > 20 units
    const anomalyFlag = data.quantity > 20;

    return this.prisma.dispenseAudit.create({
      data: {
        tenantId,
        ...data,
        anomalyFlag,
        anomalyReason: anomalyFlag ? 'Unusually high quantity dispensed — requires pharmacist review' : null,
      },
    });
  }

  async runAnomalyDetection() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log('Running pharmacy dispensing anomaly detection...');
    const flagged = await this.prisma.dispenseAudit.findMany({
      where: { tenantId, anomalyFlag: true },
      include: { medication: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return { flaggedCount: flagged.length, flagged };
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    const [totalMeds, criticalAlerts, anomalies, controlled] = await Promise.all([
      this.prisma.medicationInventory.count({ where: { tenantId } }),
      this.prisma.expiryAlert.count({ where: { tenantId, alertLevel: 'CRITICAL', resolved: false } }),
      this.prisma.dispenseAudit.count({ where: { tenantId, anomalyFlag: true } }),
      this.prisma.medicationInventory.count({ where: { tenantId, isControlled: true } }),
    ]);

    const expiryAlerts = await this.prisma.expiryAlert.findMany({
      where: { tenantId, resolved: false },
      include: { medication: true },
      orderBy: { daysRemaining: 'asc' },
      take: 10,
    });

    return { totalMeds, criticalAlerts, anomalies, controlled, expiryAlerts };
  }
}
