import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class PatientMessagingService {
  private readonly logger = new Logger(PatientMessagingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getInbox(patientId: string) {
    const tenantId = this.getTenantId();
    let inbox = await this.prisma.patientInbox.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    });

    if (inbox.length === 0) {
      await this.prisma.patientInbox.create({
        data: {
          tenantId,
          patientId,
          title: 'Welcome to MedFlow App-Portal',
          content: 'Keep track of your appointments, remote health plans, and remote clinical records.',
          category: 'GENERAL',
        },
      });
      inbox = await this.prisma.patientInbox.findMany({
        where: { tenantId, patientId },
      });
    }

    return inbox;
  }

  async markAsRead(id: string) {
    const tenantId = this.getTenantId();
    return this.prisma.patientInbox.updateMany({
      where: { id, tenantId },
      data: { isRead: true },
    });
  }

  async sendMessage(patientId: string, channel: string, body: string, subject?: string) {
    const tenantId = this.getTenantId();
    return this.prisma.patientMessage.create({
      data: {
        tenantId,
        patientId,
        channel,
        body,
        subject,
        status: 'SENT',
        sentAt: new Date(),
      },
    });
  }
}