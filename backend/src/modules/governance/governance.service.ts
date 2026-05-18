import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LogPhiAccessDto, CreateRetentionPolicyDto } from './dto/governance.dto';

@Injectable()
export class GovernanceService {
  constructor(private readonly prisma: PrismaService) {}

  async logPhiAccess(tenantId: string, dto: LogPhiAccessDto) {
    return this.prisma.phiAccessLog.create({
      data: {
        tenantId,
        userId: dto.userId,
        patientId: dto.patientId,
        action: dto.action,
        resource: dto.resource,
        reason: dto.reason,
        ipAddress: dto.ipAddress,
      },
    });
  }

  async getPhiAccessLogs(tenantId: string, patientId?: string) {
    const whereClause: any = { tenantId };
    if (patientId) {
      whereClause.patientId = patientId;
    }
    return this.prisma.phiAccessLog.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } });
  }

  async createRetentionPolicy(tenantId: string, dto: CreateRetentionPolicyDto) {
    return this.prisma.retentionPolicy.create({
      data: {
        tenantId,
        resourceType: dto.resourceType,
        retentionDays: dto.retentionDays,
        action: dto.action,
      },
    });
  }

  async getRetentionPolicies(tenantId: string) {
    return this.prisma.retentionPolicy.findMany({ where: { tenantId } });
  }
}
