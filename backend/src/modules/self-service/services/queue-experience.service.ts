import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class QueueExperienceService {
  private readonly logger = new Logger(QueueExperienceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async generateToken(patientId: string, departmentId?: string, doctorId?: string) {
    const tenantId = this.getTenantId();
    const count = await this.prisma.queueToken.count({ where: { tenantId } });
    const tokenNumber = 'TKT-' + (1000 + count + 1).toString();

    return this.prisma.queueToken.create({
      data: {
        tenantId,
        patientId,
        tokenNumber,
        departmentId,
        doctorId,
        status: 'WAITING',
        estimatedWaitMinutes: 20,
      },
    });
  }

  async getQueueStatus(patientId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.queueToken.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async digitalCheckin(patientId: string, appointmentId?: string, deviceType?: string) {
    const tenantId = this.getTenantId();
    return this.prisma.digitalCheckin.create({
      data: {
        tenantId,
        patientId,
        appointmentId,
        status: 'CHECKED_IN',
        deviceType: deviceType || 'SmartApp',
      },
    });
  }
}