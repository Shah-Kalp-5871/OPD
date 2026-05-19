import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class PatientSessionService {
  private readonly logger = new Logger(PatientSessionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async trackSession(patientId: string, data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.patientSession.create({
      data: {
        tenantId,
        patientId,
        deviceFingerprint: data.deviceFingerprint || 'unknown-fingerprint',
        sessionToken: data.sessionToken || Math.random().toString(36).substring(2),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async getActiveSessions(patientId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.patientSession.findMany({
      where: { tenantId, patientId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async registerDevice(patientId: string, data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.patientDevice.create({
      data: {
        tenantId,
        patientId,
        deviceFingerprint: data.deviceFingerprint || 'unknown-fingerprint',
        pushToken: data.pushToken,
        deviceName: data.deviceName || 'Web Portal Workstation',
        osVersion: data.osVersion || 'Windows 11',
      },
    });
  }

  async getDevices(patientId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.patientDevice.findMany({
      where: { tenantId, patientId },
      orderBy: { lastLoginAt: 'desc' },
    });
  }
}