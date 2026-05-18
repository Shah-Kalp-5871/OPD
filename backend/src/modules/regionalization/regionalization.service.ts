import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RegionalizationService {
  constructor(private readonly prisma: PrismaService) {}

  async createPolicy(tenantId: string, countryCode: string, policyType: string, rules: Record<string, any>, region?: string, effectiveTo?: Date) {
    return this.prisma.regionPolicy.create({
      data: { tenantId, countryCode, region, policyType, rules, effectiveTo },
    });
  }

  async getPolicies(tenantId: string, countryCode?: string) {
    return this.prisma.regionPolicy.findMany({
      where: { tenantId, isActive: true, ...(countryCode ? { countryCode } : {}) },
    });
  }

  async recordConsent(tenantId: string, patientId: string, type: string, granted: boolean, ipAddress?: string, userAgent?: string) {
    return this.prisma.consentRecord.create({
      data: { tenantId, patientId, type, granted, ipAddress, userAgent },
    });
  }

  async getConsents(tenantId: string, patientId: string) {
    return this.prisma.consentRecord.findMany({
      where: { tenantId, patientId },
      orderBy: { grantedAt: 'desc' },
    });
  }

  async deactivatePolicy(tenantId: string, policyId: string) {
    return this.prisma.regionPolicy.updateMany({
      where: { id: policyId, tenantId },
      data: { isActive: false },
    });
  }
}
