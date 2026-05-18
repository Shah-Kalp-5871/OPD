import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class PopulationHealthService {
  private readonly logger = new Logger(PopulationHealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  async detectHotspots(region: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log(`Scanning epidemiological data for region: ${region}`);

    // Simulated AI Epidemiology engine identifying a cluster
    const cluster = {
      disease: 'INFLUENZA_A',
      caseCount: Math.floor(Math.random() * 50) + 10,
      severity: 'MODERATE',
      trend: 'INCREASING',
    };

    const hotspot = await this.prisma.epiHotspot.create({
      data: {
        tenantId,
        disease: cluster.disease,
        region,
        caseCount: cluster.caseCount,
        severity: cluster.severity,
        trend: cluster.trend,
      }
    });

    return hotspot;
  }

  async analyzeCohortRisk(cohort: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    
    this.logger.log(`Analyzing population risk for cohort: ${cohort}`);

    // Simulated AI Risk Stratification
    const riskProfile = await this.prisma.populationRisk.create({
      data: {
        tenantId,
        cohort,
        averageRiskScore: parseFloat((Math.random() * 40 + 60).toFixed(2)),
        totalPatients: 450,
        careGaps: ["Missed HbA1c", "No Retinal Exam"],
      }
    });

    return riskProfile;
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    
    const hotspots = await this.prisma.epiHotspot.findMany({
      where: { tenantId },
      orderBy: { identifiedAt: 'desc' },
      take: 5
    });

    const cohorts = await this.prisma.populationRisk.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });

    return { hotspots, cohorts };
  }
}
